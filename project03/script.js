class GitHubFinder {
    // 상수 정의를 클래스 최상단으로 이동
    static CONSTANTS = {
        API_URL: 'https://api.github.com/users/',
        MAX_PAGES: 3,
        REPOS_PER_PAGE: 100,
        TOP_REPOS_LIMIT: 10,
        TOP_LANGUAGES_LIMIT: 10,
        CONTRIBUTION_DAYS: 365,
        MAX_CONTRIBUTION_LEVEL: 4
    };

    static LANGUAGE_COLORS = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'React': '#61dafb',
        'Vue': '#4FC08D',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Swift': '#fa7343',
        'Kotlin': '#7F52FF',
        'Ruby': '#701516',
        'Shell': '#89e051',
        'C#': '#239120',
        'Dart': '#00B4AB',
        'Scala': '#c22d40'
    };

    constructor() {
        this.apiUrl = GitHubFinder.CONSTANTS.API_URL;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
    }

    // DOM 요소 캐싱을 별도 메서드로 분리
    cacheElements() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.spinner = document.getElementById('spinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.userProfile = document.getElementById('userProfile');
        this.topReposSection = document.getElementById('topReposSection');
        this.reposSection = document.getElementById('reposSection');
        this.languageStatsSection = document.getElementById('languageStatsSection');
        this.contributionsSection = document.getElementById('contributionsSection');
    }

    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchUser();
        });
    }

    async searchUser() {
        const username = this.searchInput.value.trim();
        if (!username) return;

        this.showSpinner();
        this.hideError();
        this.hideProfile();

        try {
            const userData = await this.fetchUser(username);
            const reposData = await this.fetchAllRepos(username);
            
            this.displayUser(userData);
            this.displayTopRepos(reposData);
            this.displayRepos(reposData.slice(0, GitHubFinder.CONSTANTS.TOP_REPOS_LIMIT));
            this.displayLanguageStats(reposData);
            this.generateContributionsFromRepos(reposData);
            this.showProfile();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideSpinner();
        }
    }

    async fetchUser(username) {
        const response = await fetch(`${this.apiUrl}${username}`);
        if (!response.ok) {
            throw new Error(`User not found: ${username}`);
        }
        return await response.json();
    }

    async fetchAllRepos(username) {
        let allRepos = [];
        let page = 1;
        const { MAX_PAGES, REPOS_PER_PAGE } = GitHubFinder.CONSTANTS;

        try {
            while (page <= MAX_PAGES) {
                const response = await fetch(
                    `${this.apiUrl}${username}/repos?sort=updated&direction=desc&per_page=${REPOS_PER_PAGE}&page=${page}`
                );
                
                if (!response.ok) {
                    if (page === 1) {
                        throw new Error('Failed to fetch repositories');
                    }
                    break;
                }
                
                const repos = await response.json();
                if (repos.length === 0) break;
                
                allRepos = allRepos.concat(repos);
                page++;
            }
        } catch (error) {
            if (allRepos.length === 0) {
                throw error;
            }
        }

        return allRepos;
    }

    // Top repositories 로직을 더 명확하게 분리
    displayTopRepos(repos) {
        const topReposGrid = document.getElementById('topReposGrid');
        if (!topReposGrid || repos.length === 0) {
            this.displayNoTopRepos(topReposGrid);
            return;
        }

        const topRepos = this.getTopRepositories(repos);
        this.renderTopRepos(topReposGrid, topRepos);
    }

    displayNoTopRepos(container) {
        if (container) {
            container.innerHTML = '<div class="no-top-repos">No repositories found</div>';
        }
    }

    getTopRepositories(repos) {
        const topStar = this.findMaxRepo(repos, 'stargazers_count');
        const topWatch = this.findMaxRepo(repos, 'watchers_count');
        const topFork = this.findMaxRepo(repos, 'forks_count');

        return [
            { repo: topStar, type: 'star', icon: '⭐', title: 'Most Starred Repository', value: topStar.stargazers_count },
            { repo: topWatch, type: 'watch', icon: '👁️', title: 'Most Watched Repository', value: topWatch.watchers_count },
            { repo: topFork, type: 'fork', icon: '🍴', title: 'Most Forked Repository', value: topFork.forks_count }
        ];
    }

    findMaxRepo(repos, property) {
        return repos.reduce((max, repo) => 
            repo[property] > max[property] ? repo : max, repos[0]);
    }

    renderTopRepos(container, topRepos) {
        container.innerHTML = '';

        topRepos.forEach(({ repo, type, icon, title, value }) => {
            const card = this.createTopRepoCard(repo, type, icon, title, value);
            container.appendChild(card);
        });
    }

    createTopRepoCard(repo, type, icon, title, value) {
        const card = document.createElement('div');
        card.className = `top-repo-card ${type}-card`;
        
        const languageColor = this.getLanguageColor(repo.language);
        const secondaryStats = this.getSecondaryStats(repo, type);
        
        card.innerHTML = `
            <div class="top-repo-header">
                <span class="top-repo-icon">🥇</span>
                <span class="top-repo-title">${title}</span>
            </div>
            <div class="top-repo-name">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </div>
            <div class="top-repo-description">
                ${repo.description || 'No description available'}
            </div>
            <div class="top-repo-stats">
                <div class="top-repo-main-stat ${type}-stat">
                    <span>${icon}</span>
                    <span>${value.toLocaleString()}</span>
                </div>
                <div class="top-repo-secondary-stats">
                    ${secondaryStats}
                </div>
            </div>
            ${this.getLanguageMarkup(repo.language, languageColor)}
        `;
        
        return card;
    }

    getSecondaryStats(repo, type) {
        const stats = [];
        if (type !== 'star') stats.push(`<span>⭐ ${repo.stargazers_count}</span>`);
        if (type !== 'watch') stats.push(`<span>👁️ ${repo.watchers_count}</span>`);
        if (type !== 'fork') stats.push(`<span>🍴 ${repo.forks_count}</span>`);
        return stats.join('');
    }

    getLanguageMarkup(language, color) {
        return language ? `
            <div class="top-repo-language">
                <span class="language-dot" style="background-color: ${color}"></span>
                <span>${language}</span>
            </div>
        ` : '';
    }

    displayUser(user) {
        this.updateUserProfile(user);
        this.updateUserStats(user);
        this.updateUserDetails(user);
    }

    updateUserProfile(user) {
        document.getElementById('profileAvatar').src = user.avatar_url;
        document.getElementById('profileName').textContent = user.name || user.login;
        document.getElementById('profileUsername').textContent = `@${user.login}`;
        document.getElementById('profileBio').textContent = user.bio || 'No bio available';
        document.getElementById('viewProfileBtn').href = user.html_url;
    }

    updateUserStats(user) {
        document.getElementById('statRepos').textContent = `Public Repos: ${user.public_repos}`;
        document.getElementById('statGists').textContent = `Public Gists: ${user.public_gists}`;
        document.getElementById('statFollowers').textContent = `Followers: ${user.followers}`;
        document.getElementById('statFollowing').textContent = `Following: ${user.following}`;
    }

    updateUserDetails(user) {
        const details = document.getElementById('profileDetails');
        const joinDate = new Date(user.created_at).toLocaleDateString();
        
        details.innerHTML = `
            <div class="detail-item"><strong>Company:</strong> ${user.company || 'N/A'}</div>
            <div class="detail-item"><strong>Location:</strong> ${user.location || 'N/A'}</div>
            <div class="detail-item"><strong>Member Since:</strong> ${joinDate}</div>
            <div class="detail-item"><strong>Website/Blog:</strong> ${user.blog ? `<a href="${user.blog}" target="_blank" rel="noopener noreferrer">${user.blog}</a>` : 'N/A'}</div>
        `;
    }

    displayRepos(repos) {
        const reposList = document.getElementById('reposList');
        reposList.innerHTML = '';

        repos.forEach(repo => {
            const repoItem = this.createRepoItem(repo);
            reposList.appendChild(repoItem);
        });
    }

    createRepoItem(repo) {
        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        
        const languageColor = this.getLanguageColor(repo.language);
        const languageTag = repo.language ? 
            `<span class="repo-language" style="background: ${languageColor}; color: white;">${repo.language}</span>` : '';
        
        repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            <div class="repo-stats">
                <div class="repo-stat"><span>⭐</span><span>${repo.stargazers_count}</span></div>
                <div class="repo-stat"><span>👁️</span><span>${repo.watchers_count}</span></div>
                <div class="repo-stat"><span>🍴</span><span>${repo.forks_count}</span></div>
                ${languageTag}
            </div>
        `;
        
        return repoItem;
    }

    displayLanguageStats(repos) {
        const languageStats = document.getElementById('languageStats');
        if (!languageStats) return;

        const { languageCount, totalRepos } = this.calculateLanguageStats(repos);
        const sortedLanguages = this.getSortedLanguages(languageCount);

        if (sortedLanguages.length === 0) {
            languageStats.innerHTML = '<p class="no-languages">No language data available</p>';
            return;
        }

        this.renderLanguageStats(languageStats, sortedLanguages, totalRepos);
    }

    calculateLanguageStats(repos) {
        const languageCount = {};
        let totalRepos = 0;

        repos.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
                totalRepos++;
            }
        });

        return { languageCount, totalRepos };
    }

    getSortedLanguages(languageCount) {
        return Object.entries(languageCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, GitHubFinder.CONSTANTS.TOP_LANGUAGES_LIMIT);
    }

    renderLanguageStats(container, sortedLanguages, totalRepos) {
        container.innerHTML = '';
        const maxCount = Math.max(...sortedLanguages.map(([, count]) => count));
        
        sortedLanguages.forEach(([language, count]) => {
            const languageItem = this.createLanguageItem(language, count, totalRepos, maxCount);
            container.appendChild(languageItem);
        });

        container.appendChild(this.createLanguageTotalInfo(totalRepos, sortedLanguages.length));
    }

    createLanguageItem(language, count, totalRepos, maxCount) {
        const percentage = ((count / totalRepos) * 100).toFixed(1);
        const barWidth = (count / maxCount) * 100;
        const color = this.getLanguageColor(language);

        const languageItem = document.createElement('div');
        languageItem.className = 'language-item';
        
        languageItem.innerHTML = `
            <div class="language-info">
                <div class="language-name">
                    <span class="language-dot" style="background-color: ${color}"></span>
                    ${language}
                </div>
                <div class="language-count">${count} repos (${percentage}%)</div>
            </div>
            <div class="language-bar-container">
                <div class="language-bar" style="width: ${barWidth}%; background-color: ${color}"></div>
            </div>
        `;
        
        return languageItem;
    }

    createLanguageTotalInfo(totalRepos, uniqueLanguagesCount) {
        const totalInfo = document.createElement('div');
        totalInfo.className = 'language-total';
        totalInfo.innerHTML = `
            <div class="total-stats">
                <strong>Total: ${totalRepos} repositories with ${uniqueLanguagesCount} different languages</strong>
            </div>
        `;
        return totalInfo;
    }

    generateContributionsFromRepos(repos) {
        const { contributionMap, dates } = this.calculateContributions(repos);
        
        this.createMonthLabels(dates);
        this.createWeekdayLabels();
        this.createContributionGrid(dates, contributionMap);
    }

    calculateContributions(repos) {
        const contributionMap = new Map();
        const today = new Date();
        const dates = this.generateDateRange(today);
        
        // 날짜 맵 초기화
        dates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            contributionMap.set(dateKey, 0);
        });

        // 레포지토리 기반 기여도 계산
        repos.forEach(repo => {
            const weight = this.calculateRepoWeight(repo, today);
            const updatedDate = new Date(repo.updated_at);
            const dateKey = updatedDate.toISOString().split('T')[0];
            
            if (contributionMap.has(dateKey)) {
                const currentCount = contributionMap.get(dateKey);
                contributionMap.set(dateKey, 
                    Math.min(currentCount + weight, GitHubFinder.CONSTANTS.MAX_CONTRIBUTION_LEVEL));
            }
        });

        return { contributionMap, dates };
    }

    generateDateRange(today) {
        const dates = [];
        const { CONTRIBUTION_DAYS } = GitHubFinder.CONSTANTS;
        
        for (let i = CONTRIBUTION_DAYS - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        
        return dates;
    }

    calculateRepoWeight(repo, today) {
        let weight = 1;
        
        // 스타 수에 따른 가중치
        if (repo.stargazers_count > 50) weight += 2;
        else if (repo.stargazers_count > 10) weight += 1;
        
        // 포크 수에 따른 가중치
        if (repo.forks_count > 20) weight += 1;
        
        // 최근 업데이트에 따른 가중치
        const updatedDate = new Date(repo.updated_at);
        const daysSinceUpdate = Math.floor((today - updatedDate) / (1000 * 60 * 60 * 24));
        if (daysSinceUpdate <= 30) weight += 1;
        
        return weight;
    }

    createMonthLabels(dates) {
        const monthLabels = document.getElementById('monthLabels');
        if (!monthLabels) return;
        
        monthLabels.innerHTML = '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        let currentMonth = -1;
        let weekIndex = 0;
        
        dates.forEach((date, i) => {
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 0 && i > 0) weekIndex++;
            
            if (date.getMonth() !== currentMonth) {
                currentMonth = date.getMonth();
                
                const monthLabel = document.createElement('div');
                monthLabel.className = 'month-label';
                monthLabel.textContent = months[currentMonth];
                monthLabel.style.gridColumn = `${weekIndex + 1}`;
                monthLabels.appendChild(monthLabel);
            }
        });
    }

    createWeekdayLabels() {
        const weekdayLabels = document.getElementById('weekdayLabels');
        if (!weekdayLabels) return;
        
        weekdayLabels.innerHTML = '';
        const weekdays = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
        
        weekdays.forEach((day, index) => {
            const label = document.createElement('div');
            label.className = 'weekday-label';
            label.textContent = day;
            label.style.gridRow = `${index + 1}`;
            weekdayLabels.appendChild(label);
        });
    }

    createContributionGrid(dates, contributionMap) {
        const contributionDays = document.getElementById('contributionDays');
        if (!contributionDays) return;
        
        contributionDays.innerHTML = '';
        
        let weekIndex = 0;
        let currentWeekStart = -1;
        
        dates.forEach((date, index) => {
            const day = this.createContributionDay(date, index, contributionMap, weekIndex, currentWeekStart);
            contributionDays.appendChild(day);
            
            // 주 인덱스 업데이트
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                if (currentWeekStart !== -1) weekIndex++;
                currentWeekStart = index;
            } else if (index === 0) {
                weekIndex = 0;
            }
        });
    }

    createContributionDay(date, index, contributionMap, weekIndex, currentWeekStart) {
        const dayOfWeek = date.getDay();
        const day = document.createElement('div');
        day.className = 'contribution-day';
        
        const dateKey = date.toISOString().split('T')[0];
        const level = contributionMap.get(dateKey);
        
        if (level > 0) {
            day.classList.add(`contribution-level-${level}`);
        }
        
        day.title = this.getContributionText(level, date);
        day.style.gridColumn = `${weekIndex + 1}`;
        day.style.gridRow = `${dayOfWeek + 1}`;
        
        return day;
    }

    getContributionText(level, date) {
        const contributionTexts = {
            0: 'No contributions',
            1: '1-2 contributions',
            2: '3-5 contributions', 
            3: '6-10 contributions',
            4: '10+ contributions'
        };
        
        return `${contributionTexts[level]} on ${date.toDateString()}`;
    }

    getLanguageColor(language) {
        return GitHubFinder.LANGUAGE_COLORS[language] || '#586069';
    }

    // UI 상태 관리 메서드들
    showSpinner() {
        this.spinner.style.display = 'block';
        this.searchBtn.disabled = true;
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
        this.searchBtn.disabled = false;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }

    showProfile() {
        const sections = [
            this.userProfile,
            this.topReposSection, 
            this.reposSection,
            this.languageStatsSection,
            this.contributionsSection
        ];
        
        sections.forEach(section => {
            if (section) section.style.display = 'block';
        });
    }

    hideProfile() {
        const sections = [
            this.userProfile,
            this.topReposSection,
            this.reposSection, 
            this.languageStatsSection,
            this.contributionsSection
        ];
        
        sections.forEach(section => {
            if (section) section.style.display = 'none';
        });
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new GitHubFinder();
});