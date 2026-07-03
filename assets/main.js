// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navlinks = document.querySelector('.navlinks');
  if(burger){
    burger.addEventListener('click', () => navlinks.classList.toggle('open'));
    navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));
  }

  // scroll reveal
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));

  // animated hero line chart
  const chartEl = document.getElementById('heroChart');
  if(chartEl){
    drawChart(chartEl);
  }

  // contact form -> Formspree
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try{
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if(res.ok){
          btn.textContent = 'Message sent ✓';
          btn.style.background = '#38DDD6';
          form.reset();
        } else {
          btn.textContent = 'Something went wrong — try again';
          btn.style.background = '#e05252';
        }
      } catch(err){
        btn.textContent = 'Network error — try again';
        btn.style.background = '#e05252';
      }

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }
});

function drawChart(svg){
  const w = 500, h = 200;
  const points = 24;
  let d1 = [], d2 = [];
  let v1 = 60, v2 = 40;
  for(let i=0;i<=points;i++){
    v1 += (Math.random()-0.42)*14;
    v2 += (Math.random()-0.5)*10;
    v1 = Math.max(20, Math.min(160, v1));
    v2 = Math.max(20, Math.min(160, v2));
    d1.push(v1); d2.push(v2);
  }
  const toPath = (arr) => arr.map((v,i) => `${i===0?'M':'L'} ${(i/points)*w} ${h-v}`).join(' ');
  const path1 = toPath(d1);
  const path2 = toPath(d2);
  const areaPath = path1 + ` L ${w} ${h} L 0 ${h} Z`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2E7CF6" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#2E7CF6" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#areaFill)" stroke="none"/>
    <path d="${path1}" fill="none" stroke="#2E7CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${path2}" fill="none" stroke="#38DDD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4" opacity="0.7"/>
  `;
}
