function fillFilters(filters, products, row, query) {
    const activeFilters = {
        price: null,
        priceRange: null,
        dateSort: null,
        dateRange: null,
        category: []
    };

    function applyFilters() {
        let results = [...products];

        if (activeFilters.category.length > 0) {
            results = results.filter(p =>
                activeFilters.category.includes(p.category.toLowerCase())
            );
        }

        if (activeFilters.priceRange) {
            results = results.filter(p => {
                const price = parseFloat(p.price.replace(',', '.'));
                return price >= activeFilters.priceRange.min &&
                    price <= activeFilters.priceRange.max;
            });
        }

        if (activeFilters.price) {
            results.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(',', '.'));
                const priceB = parseFloat(b.price.replace(',', '.'));
                return activeFilters.price === 'price_1'
                    ? priceA - priceB
                    : priceB - priceA;
            });
        }

        if (activeFilters.dateRange) {
            const now = new Date();
            results = results.filter(p => {
                const productDate = new Date(p.dateAdded);
                if (activeFilters.dateRange === 'date_3') {
                    return productDate.toDateString() === now.toDateString();
                }
                if (activeFilters.dateRange === 'date_4') {
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    return productDate >= weekAgo;
                }
                if (activeFilters.dateRange === 'date_5') {
                    return productDate.getMonth() === now.getMonth() &&
                        productDate.getFullYear() === now.getFullYear();
                }
                if (activeFilters.dateRange === 'date_6') {
                    return productDate.getFullYear() === now.getFullYear();
                }
            });
        }

        if (activeFilters.dateSort) {
            results.sort((a, b) =>
                activeFilters.dateSort === 'date_1'
                    ? new Date(b.dateAdded) - new Date(a.dateAdded)
                    : new Date(a.dateAdded) - new Date(b.dateAdded)
            );
        }

        row.innerHTML = '';
        if (results.length === 0) {
            row.innerHTML = query
                ? `<p class="no_results">No se encontraron resultados para "<strong>${query}</strong>"</p>`
                : '<p class="no_results">No se encontraron resultados.</p>';
            return;
        }
        results.forEach(product => row.appendChild(createProductItem(product)));
    }

    filters.forEach(filter => {
        const container = document.getElementById(filter.id);
        if (!container) return;

        container.querySelector('.category_title').textContent = filter.title;
        const form = container.querySelector('form');
        form.innerHTML = '';

        if (filter.options) {
            filter.options.forEach(option => {

                if (option.separator) {
                    const sep = document.createElement('hr');
                    sep.className = 'filter_separator';
                    form.appendChild(sep);
                    return;
                }

                const div = document.createElement('div');
                div.className = 'checkbox_item';

                let inputType, groupName;

                if (filter.id === 'filter_category') {
                    inputType = 'checkbox';
                    groupName = 'filter_category';
                } else if (filter.id === 'filter_date') {
                    inputType = 'radio';
                    const isSort = option.id === 'date_1' || option.id === 'date_2';
                    groupName = isSort ? 'filter_date_sort' : 'filter_date_range';
                } else {
                    inputType = 'radio';
                    groupName = filter.id;
                }

                div.innerHTML = `
                    <input type="${inputType}" id="${option.id}" name="${groupName}">
                    <label for="${option.id}">${option.label}</label>
                `;
                form.appendChild(div);

                div.querySelector('input').addEventListener('change', (e) => {
                    if (filter.id === 'filter_price') {
                        activeFilters.price = e.target.checked ? option.id : null;
                    } else if (filter.id === 'filter_date') {
                        const isSort = option.id === 'date_1' || option.id === 'date_2';
                        if (isSort) {
                            activeFilters.dateSort = e.target.checked ? option.id : null;
                        } else {
                            activeFilters.dateRange = e.target.checked ? option.id : null;
                        }
                    } else if (filter.id === 'filter_category') {
                        if (e.target.checked) {
                            activeFilters.category.push(option.label.toLowerCase());
                        } else {
                            activeFilters.category = activeFilters.category
                                .filter(c => c !== option.label.toLowerCase());
                        }
                    }
                    applyFilters();
                });
            });
        }

        if (filter.range) {
            const rangeDiv = document.createElement('div');
            rangeDiv.className = 'range_item';
            rangeDiv.innerHTML = `
                <div class="range_labels">
                    <span id="range_min_label">${filter.range.min}€</span>
                    <span id="range_max_label">${filter.range.max}€</span>
                </div>
                <div class="range_track">
                    <input type="range" id="range_max" min="${filter.range.min}" max="${filter.range.max}" value="${filter.range.max}" step="1">
                    <input type="range" id="range_min" min="${filter.range.min}" max="${filter.range.max}" value="${filter.range.min}" step="1">
                </div>
            `;
            form.appendChild(rangeDiv);

            const rangeMin = rangeDiv.querySelector('#range_min');
            const rangeMax = rangeDiv.querySelector('#range_max');
            const minLabel = rangeDiv.querySelector('#range_min_label');
            const maxLabel = rangeDiv.querySelector('#range_max_label');

            const gray   = '#bbbfbf';
            const active = '#b6465f';

            function updateRange() {
                let min = parseInt(rangeMin.value);
                let max = parseInt(rangeMax.value);

                if (min > max) rangeMin.value = max;
                if (max < min) rangeMax.value = min;

                min = parseInt(rangeMin.value);
                max = parseInt(rangeMax.value);

                minLabel.textContent = `${min}€`;
                maxLabel.textContent = `${max}€`;

                const totalMin = parseInt(rangeMin.min);
                const totalMax = parseInt(rangeMax.max);
                const minPct = ((min - totalMin) / (totalMax - totalMin)) * 100;
                const maxPct = ((max - totalMin) / (totalMax - totalMin)) * 100;

                rangeMin.style.background = `linear-gradient(to right,
                    ${gray} 0%, ${gray} ${minPct}%,
                    transparent ${minPct}%, transparent 100%)`;

                rangeMax.style.background = `linear-gradient(to right,
                    ${active} 0%, ${active} ${maxPct}%,
                    ${gray} ${maxPct}%, ${gray} 100%)`;

                activeFilters.priceRange = { min, max };
                applyFilters();
            }

            rangeMin.addEventListener('input', updateRange);
            rangeMax.addEventListener('input', updateRange);
            updateRange();
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonTemplates();
    await loadTemplate('photo-row', 'photo_row');

    const data = await fetchData('search-product');
    if (!data) return;

    const productsData = await fetchData('products');
    if (!productsData) return;

    const row = document.querySelector('.photo_row');
    row.innerHTML = '';

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q')?.toLowerCase().trim() || '';

    const initialResults = query
        ? productsData.products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.seller.toLowerCase().includes(query)
        )
        : productsData.products;

    fillFilters(data.filters, initialResults, row, query);
});