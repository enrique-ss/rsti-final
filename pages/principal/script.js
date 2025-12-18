// ==================== CONFIGURAÇÕES ====================
const PERMISSIONS = {
    admin: {
        tabs: ['dash', 'clientes', 'demandas', 'entregas', 'config'],
        canCreateDemand: true,
        canEditSettings: true,
        canManageUsers: true,
        defaultTab: 'dash'
    },
    colaborador: {
        tabs: ['dash', 'clientes', 'demandas', 'entregas', 'config'],
        canCreateDemand: true,
        canEditSettings: false,
        canManageUsers: false,
        defaultTab: 'dash'
    },
    cliente: {
        tabs: ['entregas', 'config'],
        canCreateDemand: false,
        canEditSettings: false,
        canManageUsers: false,
        canMarkComplete: true, // Nova permissão
        defaultTab: 'entregas'
    }
};

const MENU_ITEMS = [
    { id: 'dash', icon: '📊', label: 'Dash' },
    { id: 'clientes', icon: '👥', label: 'Clientes' },
    { id: 'demandas', icon: '🔥', label: 'Demandas' },
    { id: 'entregas', icon: '📦', label: 'Entregas' },
    { id: 'config', icon: '⚙️', label: 'Config' }
];

const TITLES = {
    dash: 'Visão Geral',
    clientes: 'Meus Clientes',
    demandas: 'Gestão de Demandas',
    entregas: 'Controle de Entregas',
    config: 'Configurações'
};

// Dados simulados
const DATA = {
    bars: [
        { l: 'Social', v: 13 }, 
        { l: 'Design', v: 9 }, 
        { l: 'Copy', v: 5 }, 
        { l: 'Video', v: 3 }, 
        { l: 'SEO', v: 2 }
    ],
    donut: [
        { l: 'Andamento', v: 1, c: 'var(--primary)' },
        { l: 'Atrasados', v: 3, c: 'var(--warn)' },
        { l: 'Concluídos', v: 8, c: 'var(--success)' },
        { l: 'Cancelados', v: 1, c: 'var(--danger)' }
    ],
    clients: [
        { name: 'Pet Shop', email: '9tN1o@example.com', phone: '(99) 99999-9999', active: true },
        { name: 'Academia', email: '9tN1o@example.com', phone: '(99) 99999-9999', active: true },
        { name: 'Loja de Roupas', email: '9tN1o@example.com', phone: '(99) 99999-9999', active: false }
    ],
    demands: [
        { id: 1, title: 'Instagram Post', type: 'Social Media', desc: 'Criação de post para feed promocional', client: 'Pet Shop', budget: 500, delivery: '31/04/26', status: 'EM ANDAMENTO' },
        { id: 2, title: 'Banner Site', type: 'Design', desc: 'Banner para página principal do site', client: 'Academia', budget: 800, delivery: '02/06/26', status: 'EM ANDAMENTO' },
        { id: 3, title: 'Campanha Natal', type: 'Copywriting', desc: 'Textos para campanha de fim de ano', client: 'Loja de Roupas', budget: 1200, delivery: '10/12/25', status: 'ATRASADO' }
    ],
    deliveries: [
        { id: 1, title: 'Logo Redesign', type: 'Design', desc: 'Modernização da identidade visual', client: 'Pet Shop', budget: 1500, delivered: '15/11/25', status: 'CONCLUÍDO', clientApproved: true },
        { id: 2, title: 'Vídeo Promocional', type: 'Vídeo', desc: 'Vídeo institucional para redes sociais', client: 'Academia', budget: 2000, delivered: '20/10/25', status: 'CONCLUÍDO', clientApproved: false },
        { id: 3, title: 'E-commerce', type: 'SEO', desc: 'SEO completo para uma loja virtual', client: 'Loja de Roupas', budget: 5000, delivered: '05/12/25', status: 'CANCELADO', clientApproved: null },
        { id: 4, title: 'Campanha Black Friday', type: 'Social Media', desc: 'Kit completo de posts para Black Friday', client: 'Pet Shop', budget: 800, delivered: '28/11/25', status: 'CONCLUÍDO', clientApproved: true }
    ]
};

let currentUser = null;

// ==================== INICIALIZAÇÃO ====================
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRaw = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !userRaw) {
        forceLogout();
        return;
    }
    
    try {
        currentUser = JSON.parse(userRaw);
        if (!currentUser?.email) throw new Error('Dados inválidos');

        initApp();
    } catch (e) {
        console.error('Erro de sessão:', e);
        forceLogout();
    }
});

function initApp() {
    updateUserInfo();
    buildMenu();
    applyPermissions();
    initLogoutButton();
    initSidebar();
    initTheme();
    initModal();
    
    if (document.getElementById('dash')?.classList.contains('active')) {
        initCharts();
    }
    
    renderContent();
}

// ==================== MENU E NAVEGAÇÃO ====================
function buildMenu() {
    const nav = document.getElementById('mainNav');
    const rules = PERMISSIONS[currentUser.level] || PERMISSIONS.cliente;
    
    MENU_ITEMS.forEach((item, idx) => {
        if (!rules.tabs.includes(item.id)) return;
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'nav-link' + (idx === 0 ? ' active' : '');
        link.setAttribute('data-target', item.id);
        link.innerHTML = `${item.icon} <span>${item.label}</span>`;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(item.id);
        });
        
        nav.appendChild(link);
    });
}

function switchTab(targetId) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    const link = document.querySelector(`[data-target="${targetId}"]`);
    const tab = document.getElementById(targetId);
    
    if (link) link.classList.add('active');
    if (tab) tab.classList.add('active');
    
    document.getElementById('pageTitle').textContent = TITLES[targetId];
    
    if (targetId === 'dash') initCharts();
    
    if (window.innerWidth <= 840) {
        document.getElementById('sidebar').classList.add('hidden');
    }
}

// ==================== PERMISSÕES ====================
function applyPermissions() {
    const rules = PERMISSIONS[currentUser.level] || PERMISSIONS.cliente;
    
    const btnNew = document.getElementById('btnNewDemand');
    if (btnNew) btnNew.style.display = rules.canCreateDemand ? 'block' : 'none';
    
    const adminSection = document.getElementById('adminSection');
    if (adminSection) adminSection.style.display = rules.canManageUsers ? 'block' : 'none';
}

// ==================== USER INFO ====================
function updateUserInfo() {
    const formatName = (name) => {
        if(!name) return 'Usuário';
        return name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');
    };
    
    const avatar = document.querySelector('.avatar');
    if (avatar && currentUser.name) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        avatar.textContent = initials;
    }
    
    const userName = document.querySelector('.info strong');
    if (userName) userName.textContent = formatName(currentUser.name);
    
    const userLevel = currentUser.level || 'admin';
    const levelText = userLevel.charAt(0).toUpperCase() + userLevel.slice(1).toLowerCase();
    
    const userInfo = document.querySelector('.info');
    if (userInfo && !document.getElementById('userLevel')) {
        const levelEl = document.createElement('small');
        levelEl.id = 'userLevel';
        levelEl.style.cssText = 'color:var(--text-muted); font-size:0.75rem; margin-top:2px; display:block;';
        levelEl.textContent = levelText;
        userInfo.appendChild(levelEl);
    }
}

function initLogoutButton() {
    const userProfile = document.querySelector('.user-profile');
    if (!userProfile || document.querySelector('.btn-logout')) return;
    
    const btn = document.createElement('button');
    btn.className = 'btn-logout';
    btn.textContent = 'Sair';
    btn.style.cssText = `
        width: 100%; margin-top: 12px; padding: 10px;
        background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3);
        color: var(--danger); border-radius: 12px; font-size: 0.85rem; font-weight: 600;
        cursor: pointer; transition: all 0.3s;
    `;
    
    btn.onmouseenter = () => {
        btn.style.background = 'rgba(244, 63, 94, 0.2)';
        btn.style.transform = 'translateY(-2px)';
    };
    btn.onmouseleave = () => {
        btn.style.background = 'rgba(244, 63, 94, 0.1)';
        btn.style.transform = 'translateY(0)';
    };
    btn.onclick = () => {
        if (confirm('Deseja realmente sair?')) forceLogout();
    };
    
    userProfile.appendChild(btn);
}

function forceLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.replace('../login/index.html');
}

// ==================== SIDEBAR ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    
    if (toggleBtn) toggleBtn.onclick = () => sidebar.classList.remove('hidden');
    if (closeBtn) closeBtn.onclick = () => sidebar.classList.add('hidden');
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 840 && sidebar && !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target) && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    });
}

// ==================== TEMA ====================
function initTheme() {
    const themeBtn = document.getElementById('theme');
    const body = document.body;
    
    if (localStorage.theme === 'light') body.classList.add('light');
    if (themeBtn) themeBtn.textContent = body.classList.contains('light') ? '☀️' : '🌙';
    
    if (themeBtn) {
        themeBtn.onclick = () => {
            body.classList.toggle('light');
            localStorage.theme = body.classList.contains('light') ? 'light' : 'dark';
            themeBtn.textContent = body.classList.contains('light') ? '☀️' : '🌙';
        };
    }
}

// ==================== GRÁFICOS ====================
function initCharts() {
    renderBarChart();
    renderDonutChart();
}

function renderBarChart() {
    const barEl = document.getElementById('bars');
    if (!barEl || barEl.innerHTML !== '') return;
    
    const max = Math.max(...DATA.bars.map(d => d.v));
    
    DATA.bars.forEach(d => {
        const g = document.createElement('div');
        g.className = 'bar-group';
        
        const b = document.createElement('div');
        b.className = 'bar';
        b.style.height = '0%';
        b.setAttribute('data-val', d.v);
        setTimeout(() => b.style.height = (d.v / max * 100) + '%', 100);
        
        const l = document.createElement('div');
        l.className = 'lbl';
        l.textContent = d.l;
        
        g.append(b, l);
        barEl.appendChild(g);
    });
}

function renderDonutChart() {
    const donutEl = document.getElementById('donut');
    const legEl = document.getElementById('legend');
    
    if (!donutEl || !legEl || donutEl.innerHTML !== '') return;
    
    const w = 140, h = 140, radius = 65, holeRadius = 45;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    
    const total = DATA.donut.reduce((a, b) => a + b.v, 0);
    let currentAngle = 0;
    
    DATA.donut.forEach(d => {
        const fraction = d.v / total;
        const angle = fraction * 2 * Math.PI;
        
        const x1_out = Math.cos(currentAngle) * radius;
        const y1_out = Math.sin(currentAngle) * radius;
        const x2_out = Math.cos(currentAngle + angle) * radius;
        const y2_out = Math.sin(currentAngle + angle) * radius;
        
        const x1_in = Math.cos(currentAngle) * holeRadius;
        const y1_in = Math.sin(currentAngle) * holeRadius;
        const x2_in = Math.cos(currentAngle + angle) * holeRadius;
        const y2_in = Math.sin(currentAngle + angle) * holeRadius;
        
        const big = fraction > 0.5 ? 1 : 0;
        
        const pathCmd = `
            M ${x1_out} ${y1_out}
            A ${radius} ${radius} 0 ${big} 1 ${x2_out} ${y2_out}
            L ${x2_in} ${y2_in}
            A ${holeRadius} ${holeRadius} 0 ${big} 0 ${x1_in} ${y1_in}
            Z
        `;
        
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', pathCmd);
        path.setAttribute('fill', d.c);
        
        const title = document.createElementNS(ns, 'title');
        title.textContent = `${d.l}: ${d.v}`;
        path.appendChild(title);
        
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('transform', `translate(${w/2},${h/2})`);
        g.appendChild(path);
        svg.appendChild(g);
        
        currentAngle += angle;
        
        legEl.innerHTML += `
            <div class="leg-item">
                <span><span class="dot" style="background:${d.c}"></span>${d.l}</span>
                <b>${d.v}</b>
            </div>`;
    });
    
    donutEl.appendChild(svg);
}

// ==================== RENDERIZAR CONTEÚDO ====================
function renderContent() {
    renderClients();
    renderDemands();
    renderDeliveries();
    renderConfig();
    renderDashboardLists();
}

function renderDashboardLists() {
    const nextDel = document.getElementById('nextDeliveries');
    const alerts = document.getElementById('alertsList');
    
    if (nextDel) {
        nextDel.innerHTML = `
            <div class="item">
                <div class="icon purple">IG</div>
                <div class="desc">
                    <b>Instagram Post</b>
                    <small>31/04/26 • Social</small>
                </div>
                <div class="badge success">ATIVO</div>
            </div>
            <div class="item">
                <div class="icon blue">BN</div>
                <div class="desc">
                    <b>Banner Site</b>
                    <small>02/06/26 • Design</small>
                </div>
                <div class="badge success">ATIVO</div>
            </div>
        `;
    }
    
    if (alerts) {
        alerts.innerHTML = `
            <div class="item">
                <div class="desc">
                    <b>Natal Campaign</b>
                    <small class="danger">Atrasada há 5 dias</small>
                </div>
                <span class="badge danger">URGENTE</span>
            </div>
        `;
    }
}

function renderClients() {
    const list = document.getElementById('clientsList');
    if (!list) return;
    
    list.innerHTML = DATA.clients.map(c => `
        <div class="item">
            <div class="desc">
                <b>${c.name}</b>
                <small>Email: ${c.email}<br>Telefone: ${c.phone}</small>
            </div>
            <span class="badge ${c.active ? 'success' : 'danger'}">${c.active ? 'ATIVO' : 'INATIVO'}</span>
        </div>
    `).join('');
}

function renderDemands() {
    const list = document.getElementById('demandsList');
    if (!list) return;
    
    list.innerHTML = DATA.demands.map(d => `
        <div class="item">
            <div class="desc">
                <b>${d.title}</b>
                <small>Tipo: ${d.type}<br>Descrição: ${d.desc}<br>Cliente: ${d.client}<br>Orçamento: R$ ${d.budget.toFixed(2)}<br>Entrega: ${d.delivery}</small>
            </div>
            <span class="badge ${d.status === 'ATRASADO' ? 'danger' : 'success'}">${d.status}</span>
        </div>
    `).join('');
}

function renderDeliveries() {
    const list = document.getElementById('deliveriesList');
    if (!list) return;
    
    const rules = PERMISSIONS[currentUser.level] || PERMISSIONS.cliente;
    
    list.innerHTML = DATA.deliveries.map(d => {
        const showCheckbox = rules.canMarkComplete && d.status === 'CONCLUÍDO';
        const checked = d.clientApproved ? 'checked' : '';
        
        // Define o status baseado na aprovação do cliente
        let displayStatus = d.status;
        let badgeClass = 'success';
        
        if (showCheckbox) {
            if (d.clientApproved) {
                displayStatus = 'CONCLUÍDO';
                badgeClass = 'success';
            } else {
                displayStatus = 'EM ANDAMENTO';
                badgeClass = 'warning';
            }
        } else if (d.status === 'CANCELADO') {
            displayStatus = 'CANCELADO';
            badgeClass = 'danger';
        }
        
        return `
            <div class="item">
                <div class="desc">
                    <b>${d.title}</b>
                    <small>Tipo: ${d.type}<br>Descrição: ${d.desc}<br>Cliente: ${d.client}<br>Orçamento: R$ ${d.budget.toFixed(2)}<br>${d.status === 'CANCELADO' ? 'Cancelado em' : 'Entregue em'}: ${d.delivered}</small>
                </div>
                ${showCheckbox ? `
                    <div class="status-check">
                        <input type="checkbox" id="check-${d.id}" ${checked} onchange="toggleApproval(${d.id})">
                        <label for="check-${d.id}" class="checkbox-custom" title="${d.clientApproved ? 'Desmarcar como concluído' : 'Marcar como concluído'}"></label>
                    </div>
                ` : ''}
                <span class="badge ${badgeClass}">${displayStatus}</span>
            </div>
        `;
    }).join('');
}

window.toggleApproval = function(id) {
    const delivery = DATA.deliveries.find(d => d.id === id);
    if (!delivery) return;
    
    delivery.clientApproved = !delivery.clientApproved;
    
    const msg = delivery.clientApproved 
        ? `✅ Projeto "${delivery.title}" marcado como CONCLUÍDO!`
        : `⚠️ Projeto "${delivery.title}" voltou para EM ANDAMENTO.`;
    
    // Feedback visual com toast personalizado
    showToast(msg, delivery.clientApproved ? 'success' : 'warning');
    
    // Re-renderiza para atualizar o status
    renderDeliveries();
};

// Sistema de Toast Notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.95) 100%)';
    
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 14px 20px;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
        font-weight: 600;
        font-size: 0.85rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out, slideOutRight 0.3s ease-in 2.7s;
        backdrop-filter: blur(10px);
        letter-spacing: 0.3px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Adiciona animações do toast ao CSS dinamicamente
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function renderConfig() {
    renderProfile();
    renderPreferences();
    renderSecurity();
    renderAbout();
    renderUsersTable();
}

function renderProfile() {
    const section = document.getElementById('profileSection');
    if (!section) return;
    
    section.innerHTML = `
        <div class="config-item">
            <label>Nome Completo</label>
            <input type="text" value="${currentUser.name || 'João Silva'}" disabled class="config-input">
        </div>
        <div class="config-item">
            <label>Email</label>
            <input type="email" value="${currentUser.email || 'joao.silva@empresa.com'}" disabled class="config-input">
        </div>
        <div class="config-item">
            <label>Telefone</label>
            <input type="tel" value="(51) 99999-9999" disabled class="config-input">
        </div>
        <div class="config-item">
            <label>Cargo</label>
            <input type="text" value="${currentUser.level || 'Designer'}" disabled class="config-input">
        </div>
    `;
}

function renderPreferences() {
    const section = document.getElementById('preferencesSection');
    if (!section) return;
    
    section.innerHTML = `
        <div class="config-item">
            <label>Idioma</label>
            <select class="config-input">
                <option value="pt-br">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </div>
        <div class="config-item">
            <label>Tema</label>
            <select class="config-input">
                <option value="dark">🌙 Escuro</option>
                <option value="light">☀️ Claro</option>
            </select>
        </div>
        <div class="config-item">
            <label>Notificações por Email</label>
            <div class="toggle-switch">
                <input type="checkbox" id="emailNotif" checked>
                <label for="emailNotif" class="toggle-label"></label>
            </div>
        </div>
        <div class="config-item">
            <label>Notificações Push</label>
            <div class="toggle-switch">
                <input type="checkbox" id="pushNotif" checked>
                <label for="pushNotif" class="toggle-label"></label>
            </div>
        </div>
    `;
}

function renderSecurity() {
    const section = document.getElementById('securitySection');
    if (!section) return;
    
    section.innerHTML = `
        <div class="config-item">
            <label>Alterar Senha</label>
            <button class="btn-action">Alterar Senha</button>
        </div>
        <div class="config-item">
            <label>Autenticação em Dois Fatores</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="toggle-switch">
                    <input type="checkbox" id="2fa">
                    <label for="2fa" class="toggle-label"></label>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Desativado</span>
            </div>
        </div>
        <div class="config-item">
            <label>Última Sessão</label>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">17/12/2025 às 14:32</p>
        </div>
    `;
}

function renderAbout() {
    const section = document.getElementById('aboutSection');
    if (!section) return;
    
    section.innerHTML = `
        <div class="config-item">
            <label>Versão do Sistema</label>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">v1.0.0 Beta</p>
        </div>
        <div class="config-item">
            <label>Última Atualização</label>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">15/12/2025</p>
        </div>
        <div class="config-item">
            <button class="btn-action">Termos de Uso</button>
        </div>
        <div class="config-item">
            <button class="btn-action">Política de Privacidade</button>
        </div>
    `;
}

function renderUsersTable() {
    const table = document.getElementById('usersTable');
    if (!table) return;
    
    const users = [
        { name: 'João Silva', email: 'joao.silva@empresa.com', cargo: 'designer', level: 'admin', active: true },
        { name: 'Maria Santos', email: 'maria.santos@empresa.com', cargo: 'desenvolvedor', level: 'user', active: true },
        { name: 'Pedro Oliveira', email: 'pedro.oliveira@empresa.com', cargo: 'copywriter', level: 'viewer', active: false }
    ];
    
    table.innerHTML = `
        <div class="table-header">
            <div class="th">Nome</div>
            <div class="th">Email</div>
            <div class="th">Cargo</div>
            <div class="th">Nível de Acesso</div>
            <div class="th">Status</div>
        </div>
        ${users.map(u => `
            <div class="table-row">
                <div class="td"><strong>${u.name}</strong></div>
                <div class="td">${u.email}</div>
                <div class="td">
                    <select class="cargo-select">
                        <option value="designer" ${u.cargo === 'designer' ? 'selected' : ''}>Designer</option>
                        <option value="desenvolvedor" ${u.cargo === 'desenvolvedor' ? 'selected' : ''}>Desenvolvedor</option>
                        <option value="copywriter" ${u.cargo === 'copywriter' ? 'selected' : ''}>Copywriter</option>
                        <option value="gestor" ${u.cargo === 'gestor' ? 'selected' : ''}>Gestor</option>
                        <option value="analista" ${u.cargo === 'analista' ? 'selected' : ''}>Analista</option>
                    </select>
                </div>
                <div class="td">
                    <select class="access-select">
                        <option value="user" ${u.level === 'user' ? 'selected' : ''}>Usuário</option>
                        <option value="admin" ${u.level === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="viewer" ${u.level === 'viewer' ? 'selected' : ''}>Cliente</option>
                    </select>
                </div>
                <div class="td"><span class="badge ${u.active ? 'success' : 'danger'}">${u.active ? 'ATIVO' : 'INATIVO'}</span></div>
            </div>
        `).join('')}
    `;
}

// ==================== MODAL ====================
function initModal() {
    const modal = document.getElementById('modalDemand');
    const btnNew = document.getElementById('btnNewDemand');
    const btnClose = document.getElementById('closeModal');
    const btnCancel = document.getElementById('btnCancel');
    const form = document.getElementById('formDemand');
    
    if (!modal) return;
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (form) form.reset();
    };
    
    if (btnNew) btnNew.onclick = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;
    
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.onclick = closeModal;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
    
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            alert(`✅ Demanda "${formData.get('titulo')}" criada com sucesso!`);
            closeModal();
        };
    }
    
    const dateInput = document.getElementById('dataEntrega');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}