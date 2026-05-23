import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private platform: 'native' | 'web';
  private localStorageKey = 'wishlist';

  constructor() {
    this.platform = Capacitor.getPlatform() === 'web' ? 'web' : 'native';
  }

  // -------- WEB: LOCALSTORAGE --------

  private getLocalWishlist(): { id: string; userId: string; dateAdded: string }[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private setLocalWishlist(items: { id: string; userId: string; dateAdded: string }[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
  }

  // -------- DB INIT --------

  private async createSQLiteConnection(): Promise<void> {
    if (!this.db) {
      this.db = await this.sqlite.createConnection(
        'marketfreak_db',
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS wishlist (
          id TEXT NOT NULL,
          userId TEXT NOT NULL,
          dateAdded TEXT NOT NULL,
          PRIMARY KEY (id, userId)
        );
      `);
    }
  }

  // -------- CRUD (WEB + NATIVE) --------

  async getWishlistIds(userId: string): Promise<{ id: string; dateAdded: string }[]> {
    if (this.platform === 'web') {
      return this.getLocalWishlist()
        .filter(item => item.userId === userId)
        .map(({ id, dateAdded }) => ({ id, dateAdded }));
    }
    await this.createSQLiteConnection();
    const result = await this.db!.query(
      `SELECT id, dateAdded FROM wishlist WHERE userId = ?`,
      [userId]
    );
    return result.values ?? [];
  }

  async addToWishlist(productId: string, userId: string): Promise<void> {
    const dateAdded = new Date().toISOString().split('T')[0];
    if (this.platform === 'web') {
      const items = this.getLocalWishlist();
      const exists = items.some(i => i.id === productId && i.userId === userId);
      if (!exists) {
        items.push({ id: productId, userId, dateAdded });
        this.setLocalWishlist(items);
      }
      return;
    }
    await this.createSQLiteConnection();
    await this.db!.run(
      `INSERT OR IGNORE INTO wishlist (id, userId, dateAdded) VALUES (?, ?, ?)`,
      [productId, userId, dateAdded]
    );
  }

  async removeFromWishlist(productId: string, userId: string): Promise<void> {
    if (this.platform === 'web') {
      const items = this.getLocalWishlist().filter(
        i => !(i.id === productId && i.userId === userId)
      );
      this.setLocalWishlist(items);
      return;
    }
    await this.createSQLiteConnection();
    await this.db!.run(
      `DELETE FROM wishlist WHERE id = ? AND userId = ?`,
      [productId, userId]
    );
  }

  async isInWishlist(productId: string, userId: string): Promise<boolean> {
    if (this.platform === 'web') {
      return this.getLocalWishlist().some(
        i => i.id === productId && i.userId === userId
      );
    }
    await this.createSQLiteConnection();
    const result = await this.db!.query(
      `SELECT id FROM wishlist WHERE id = ? AND userId = ?`,
      [productId, userId]
    );
    return (result.values?.length ?? 0) > 0;
  }
}