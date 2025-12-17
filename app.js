// TMHNA Enterprise Portal - Shared JavaScript

// Sample data (hardcoded, realistic)
const sampleData = {
    enterprise: {
        revenue: 2800000000,
        margin: 24.3,
        service: 842000000,
        digital: 34.7,
        fleetUptime: 96.8,
        automationBacklog: 47
    },
    toyota: {
        revenue: 1600000000,
        margin: 25.1,
        service: 485000000,
        digital: 38.2
    },
    raymond: {
        revenue: 720000000,
        margin: 22.8,
        service: 218000000,
        digital: 28.5
    },
    thd: {
        revenue: 480000000,
        margin: 23.9,
        service: 139000000,
        digital: 31.2
    }
};

// Current state
let currentRole = 'Executive';
let currentBrand = 'All TMHNA';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeRoleSwitcher();
    initializeBrandFilter();
    initializeSearch();
    updatePageForRole();
    updatePageForBrand();
});

// Navigation
function initializeNavigation() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const linkFile = link.getAttribute('href');
        if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Role Switcher
function initializeRoleSwitcher() {
    const roleSwitcher = document.getElementById('role-switcher');
    if (roleSwitcher) {
        roleSwitcher.value = currentRole;
        roleSwitcher.addEventListener('change', (e) => {
            currentRole = e.target.value;
            updatePageForRole();
        });
    }
}

function updatePageForRole() {
    // Hide/show role-specific content sections
    document.querySelectorAll('.role-content').forEach(el => {
        const requiredRoles = el.getAttribute('data-role').split(',').map(r => r.trim());
        if (requiredRoles.includes(currentRole) || requiredRoles.includes('all')) {
            el.classList.add('active');
            el.classList.remove('hidden');
        } else {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });
    
    // Update role badge if exists
    const roleBadge = document.getElementById('current-role-badge');
    if (roleBadge) {
        roleBadge.textContent = currentRole;
    }
    
    // Update page title/subtitle based on role
    updatePageHeaderForRole();
    
    // Update dashboard widgets based on role
    updateDashboardForRole();
}

function updatePageHeaderForRole() {
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageSubtitle) {
        const roleSubtitles = {
            'Executive': 'Executive overview and enterprise insights',
            'Finance Leader': 'Financial intelligence and performance metrics',
            'Plant Leader': 'Operations, fleet, and plant performance',
            'Dealer Manager': 'Dealer network performance and insights'
        };
        pageSubtitle.textContent = roleSubtitles[currentRole] || pageSubtitle.textContent;
    }
}

function updateDashboardForRole() {
    // Role-specific KPI visibility
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        const roleAttr = card.getAttribute('data-role');
        if (roleAttr) {
            const allowedRoles = roleAttr.split(',').map(r => r.trim());
            if (allowedRoles.includes(currentRole) || allowedRoles.includes('all')) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Brand Filter
function initializeBrandFilter() {
    const brandFilter = document.getElementById('brand-filter');
    if (brandFilter) {
        brandFilter.value = currentBrand;
        brandFilter.addEventListener('change', (e) => {
            currentBrand = e.target.value;
            updatePageForBrand();
        });
    }
}

function updatePageForBrand() {
    const brandData = currentBrand === 'All TMHNA' ? sampleData.enterprise : 
                     currentBrand === 'Toyota' ? sampleData.toyota :
                     currentBrand === 'Raymond' ? sampleData.raymond : sampleData.thd;
    
    // Update KPI values
    document.querySelectorAll('[data-kpi]').forEach(el => {
        const kpi = el.getAttribute('data-kpi');
        if (brandData[kpi] !== undefined) {
            if (kpi === 'revenue' || kpi === 'service') {
                el.textContent = formatCurrency(brandData[kpi]);
            } else if (kpi === 'margin') {
                el.textContent = brandData[kpi].toFixed(1) + '%';
            } else if (kpi === 'digital') {
                el.textContent = brandData[kpi].toFixed(1) + '%';
            } else if (kpi === 'fleetUptime') {
                el.textContent = brandData[kpi].toFixed(1) + '%';
            } else {
                el.textContent = brandData[kpi];
            }
        }
    });
    
    // Update brand labels
    document.querySelectorAll('[data-brand-label]').forEach(el => {
        el.textContent = currentBrand;
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterSearchableContent(query);
        });
    }
}

function filterSearchableContent(query) {
    // Filter tables, feeds, etc. based on search query
    document.querySelectorAll('[data-searchable]').forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
}

// Tab functionality
function initializeTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const tabs = container.querySelectorAll('.tab');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active to selected
            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Drawer/Expandable functionality
function initializeDrawers() {
    document.querySelectorAll('.drawer-header').forEach(header => {
        header.addEventListener('click', () => {
            const drawer = header.closest('.drawer');
            const content = drawer.querySelector('.drawer-content');
            content.classList.toggle('active');
        });
    });
}

// Format currency
function formatCurrency(value) {
    if (value >= 1000000000) {
        return '$' + (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(0) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value.toFixed(0);
}

// Initialize tabs and drawers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs('profitability-tabs');
    initializeTabs('comms-tabs');
    initializeDrawers();
});

// Export for use in other scripts if needed
window.portalApp = {
    currentRole,
    currentBrand,
    sampleData,
    formatCurrency,
    updatePageForRole,
    updatePageForBrand
};
