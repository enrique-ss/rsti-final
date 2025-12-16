// DADOS
const barData = [
    { L: 'Social', V: 14 }, { L: 'Design', V: 9 }, 
    { L: 'Copy', V: 5 }, { L: 'Video', V: 3 }, { L: 'SEO', V: 2 }
];
const donutData = [
    { L: 'Andamento', V: 12, C: 'var(--c1)' },
    { L: 'Revisão', V: 5, C: 'var(--c3)' },
    { L: 'Finalizado', V: 3, C: 'var(--c5)' },
    { L: 'Cancelado', V: 1, C: 'var(--c4)' }
];

// TEMA
const btnTheme = document.getElementById('themeToggle');
if(localStorage.getItem('theme') === 'light') document.body.classList.add('light');
updateIcon();

btnTheme.onclick = () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    updateIcon();
};

function updateIcon() {
    btnTheme.innerText = document.body.classList.contains('light') ? '☀️' : '🌙';
}

// RENDERIZAR
document.addEventListener('DOMContentLoaded', () => {
    // 1. Barras
    const barC = document.getElementById('barChart');
    const max = Math.max(...barData.map(d => d.V));
    
    barData.forEach(d => {
        const grp = document.createElement('div');
        grp.className = 'bar-group';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '0%';
        bar.setAttribute('data-val', d.V);
        setTimeout(() => bar.style.height = (d.V/max)*100 + '%', 100);

        const lbl = document.createElement('div');
        lbl.className = 'lbl';
        lbl.innerText = d.L;

        grp.append(bar, lbl);
        barC.appendChild(grp);
    });

    // 2. Rosca (SVG)
    const donC = document.getElementById('donutChart');
    const legC = document.getElementById('donutLegend');
    const W = 100, H = 100, R = 50, hole = 35;
    const ns = "http://www.w3.org/2000/svg";
    
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    
    const total = donutData.reduce((a,b) => a+b.V, 0);
    let ang = 0;

    donutData.forEach(d => {
        const perc = d.V / total;
        const rad = perc * 2 * Math.PI;
        const x1 = Math.cos(ang)*R, y1 = Math.sin(ang)*R;
        const x2 = Math.cos(ang+rad)*R, y2 = Math.sin(ang+rad)*R;
        const big = perc > .5 ? 1 : 0;
        
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", `M0 0 L${x1} ${y1} A${R} ${R} 0 ${big} 1 ${x2} ${y2} Z`);
        path.setAttribute("fill", d.C);
        path.setAttribute("class", "slice");
        
        // Tooltip simples nativo
        const title = document.createElementNS(ns, "title");
        title.textContent = `${d.L}: ${d.V}`;
        path.appendChild(title);

        const g = document.createElementNS(ns, "g");
        g.setAttribute("transform", `translate(${W/2},${H/2})`);
        g.appendChild(path);
        svg.appendChild(g);
        
        ang += rad;

        // Legenda
        legC.innerHTML += `
            <div class="leg-item">
                <span><span class="dot" style="background:${d.C}"></span>${d.L}</span>
                <b>${d.V}</b>
            </div>`;
    });

    // Buraco
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", W/2); c.setAttribute("cy", H/2); c.setAttribute("r", hole);
    c.setAttribute("fill", "var(--card)");
    svg.appendChild(c);
    donC.appendChild(svg);
});