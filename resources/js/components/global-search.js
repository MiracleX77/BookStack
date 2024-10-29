import {htmlToDom} from '../services/dom';
import {debounce} from '../services/util';
import {KeyboardNavigationHandler} from '../services/keyboard-navigation';
import {Component} from './component';

/**
 * Global (header) search box handling.
 * Mainly to show live results preview.
 */
export class GlobalSearch extends Component {

    setup() {
        this.container = this.$el;
        this.input = this.$refs.input;
        this.suggestions = this.$refs.suggestions;
        this.suggestionResultsWrap = this.$refs.suggestionResults;
        this.searchHistoryWrap = this.$refs.history;
        this.searchHistoryResultsWrap = this.$refs.historyResults;
        this.loadingWrap = this.$refs.loading;
        this.button = this.$refs.button;

        this.setupListeners();
    }

    setupListeners() {
        const updateSuggestionsDebounced = debounce(this.updateSuggestions.bind(this), 200, false);
        const updateSearchHistoryDebounced = debounce(this.updateSearchHistory.bind(this), 200, false);


        // Handle search input changes
        this.input.addEventListener('input', () => {
            const {value} = this.input;
            if (value.length > 0) {
                this.suggestionResultsWrap.style.display='block';
                this.suggestions.style.display = 'block';
                this.loadingWrap.style.display = 'block';
                this.suggestions.style.opacity = '1';
                this.suggestionResultsWrap.style.opacity = '0.5';
                updateSuggestionsDebounced(value);
            } else {
                this.searchHistoryResultsWrap.style.display = 'block';
                this.suggestionResultsWrap.style.display = 'none';
                this.loadingWrap.style.display = 'none';
                updateSearchHistoryDebounced();
            }
        });

        // Allow double click to show auto-click suggestions
        this.input.addEventListener('dblclick', () => {
            this.input.setAttribute('autocomplete', 'on');
            this.button.focus();
            this.input.focus();
        });

        this.input.addEventListener('focus', () => {
            this.container.classList.add('search-active');
            this.searchHistoryWrap.style.display = 'block';
            this.searchHistoryResultsWrap.style.display = 'block';
            this.suggestions.style.display = 'none';
            this.searchHistoryWrap.style.opacity = '1';
            updateSearchHistoryDebounced();
        });
        // Detect clicking outside input
        document.addEventListener('click', (event) => {
            if (!this.container.contains(event.target)) {
                this.hideSuggestions();

            }
        });

        new KeyboardNavigationHandler(this.container, () => {
            this.hideSuggestions();
        });
    }

    async updateSearchHistory() {
        const {data: results} = await window.$http.get('/search/history');
        if (!results) {
            return;
        }
        const resultDom = htmlToDom(results);
        this.searchHistoryResultsWrap.innerHTML = '';
        this.searchHistoryResultsWrap.style.opacity = '1';
        this.searchHistoryResultsWrap.append(resultDom);


    }
    /**
     * @param {String} search
     */
    async updateSuggestions(search) {
        const {data: results} = await window.$http.get('/search/suggest', {term: search});
        if (!this.input.value) {
            return;
        }

        const resultDom = htmlToDom(results);

        this.suggestionResultsWrap.innerHTML = '';
        this.suggestionResultsWrap.style.opacity = '1';
        this.loadingWrap.style.display = 'none';
        this.suggestionResultsWrap.append(resultDom);
        if (!this.container.classList.contains('search-active')) {
            this.showSuggestions();
        }
    }

    showSuggestions() {
        window.requestAnimationFrame(() => {
            this.suggestions.classList.add('search-suggestions-animation');
        });
    }

    hideSuggestions() {
        this.container.classList.remove('search-active');
        this.suggestions.classList.remove('search-suggestions-animation');
        this.suggestionResultsWrap.innerHTML = '';
        this.suggestions.style.display = 'none';
        this.suggestionResultsWrap.style.display = 'none';
        this.searchHistoryResultsWrap.innerHTML='';
        this.searchHistoryResultsWrap.style.display='none';
    }

    async getSearchHistory() {
        const {data: results} = await window.$http.get('/search/history');
        return results;
    }
}
