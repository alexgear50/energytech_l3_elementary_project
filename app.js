const APPS_SCRIPT_URL = ""; // Paste your deployed Google Apps Script Web App URL here.
let student = JSON.parse(localStorage.getItem('l3_student')||'{}');
let currentUnit = null; let currentSkill = 'vocabulary';
const $ = s => document.querySelector(s);
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function init(){
  $('#studentName').value=student.name||''; $('#studentId').value=student.id||''; $('#studentGroup').value=student.group||'';
  $('#saveStudent').onclick=saveStudent; $('#progressBtn').onclick=showProgress; $('#teacherBtn').onclick=showTeacher;
  renderUnits();
}
function saveStudent(){student={name:$('#studentName').value.trim(),id:$('#studentId').value.trim(),group:$('#studentGroup').value.trim()};localStorage.setItem('l3_student',JSON.stringify(student));alert('Student details saved.');}
function renderUnits(){const grid=$('#unitGrid');grid.innerHTML='';LEVEL3_DATA.units.forEach(u=>{const div=document.createElement('div');div.className='unit-card';div.innerHTML=`<h3>Unit ${u.id}: ${u.title}</h3><p><strong>Grammar:</strong> ${u.grammarFocus}</p><p><strong>Vocabulary:</strong> ${u.vocabularyFocus}</p><span class="pill">50 Grammar</span><span class="pill">50 Vocabulary</span><span class="pill">20 Reading</span><span class="pill">Listening</span><span class="pill">Speaking</span><span class="pill">Writing</span><div class="actions"><button>Open Unit Practice</button></div>`;div.querySelector('button').onclick=()=>openUnit(u.id);grid.appendChild(div)});}
function setLandingVisible(show){
  document.querySelector('.hero').classList.toggle('hidden',!show);
  $('#studentPanel').classList.toggle('hidden',!show);
  $('#unitGrid').classList.toggle('hidden',!show);
  if(!show){$('#progressBox').classList.add('hidden');$('#teacherBox').classList.add('hidden');}
}
function openUnit(id){currentUnit=LEVEL3_DATA.units.find(u=>u.id===id);currentSkill='vocabulary';setLandingVisible(false);$('#practice').classList.remove('hidden');renderPractice();window.scrollTo({top:0,behavior:'smooth'});}
function backToLanding(){currentUnit=null;$('#practice').classList.add('hidden');setLandingVisible(true);window.scrollTo({top:0,behavior:'smooth'});}
function renderPractice(){const p=$('#practice');const u=currentUnit;const tabs=['vocabulary','grammar','reading','listening','speaking','writing'];p.innerHTML=`<div class="practice-top"><button class="secondary" id="backHome">← Back to Landing Page</button><div><h2>Unit ${u.id}: ${u.title}</h2><p class="unit-focus"><strong>Grammar:</strong> ${u.grammarFocus} • <strong>Vocabulary:</strong> ${u.vocabularyFocus}</p></div></div><div class="tabs">${tabs.map(t=>`<button class="tab ${t===currentSkill?'active':''}" data-tab="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div id="skillArea"></div>`;$('#backHome').onclick=backToLanding;p.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{currentSkill=b.dataset.tab;renderPractice()});renderSkill();}
function renderSkill(){const area=$('#skillArea');const u=currentUnit;if(currentSkill==='vocabulary') return renderQuiz(area, shuffle(u.vocabulary), 'Vocabulary');if(currentSkill==='grammar') return renderQuiz(area, shuffle(u.grammar), 'Grammar');if(currentSkill==='reading') return renderReading(area,u);if(currentSkill==='listening') return renderListening(area,u);if(currentSkill==='writing') return renderWriting(area,u);if(currentSkill==='speaking') return renderSpeaking(area,u);}
function renderQuiz(area, qs, label){area.innerHTML=`<p class="pill">${label}: questions are shuffled and answers are randomized.</p><form id="quizForm"></form><div class="actions"><button id="submitQuiz" type="button">Submit ${label}</button></div><div id="result"></div>`;const form=$('#quizForm');qs.forEach((q,i)=>{const opts=shuffle(q.options);const block=document.createElement('div');block.className='question';block.innerHTML=`<h4>${i+1}. ${q.q}</h4>`+opts.map(o=>`<label class="option"><input type="radio" name="q${i}" value="${encodeURIComponent(o)}"> ${o}</label>`).join('');block.dataset.answer=q.answer;form.appendChild(block)});$('#submitQuiz').onclick=()=>gradeQuiz(label);}
function gradeQuiz(skill){let score=0;const blocks=[...document.querySelectorAll('.question')];blocks.forEach((b,i)=>{const chosen=document.querySelector(`input[name=q${i}]:checked`);if(chosen && decodeURIComponent(chosen.value)===b.dataset.answer) score++;});$('#result').innerHTML=`<p class="score">Score: ${score}/${blocks.length}</p>`;saveResult(skill,score,blocks.length);}
function renderReading(area,u){const r=u.reading;area.innerHTML=`<h3>${r.title}</h3><div class="reading-text">${r.text}</div><form id="quizForm"></form><div class="actions"><button id="submitQuiz" type="button">Submit Reading</button></div><div id="result"></div>`;const form=$('#quizForm');r.questions.forEach((q,i)=>{const opts=q.options.length>2?shuffle(q.options):q.options;const block=document.createElement('div');block.className='question';block.innerHTML=`<h4>${i+1}. ${q.q}</h4>`+opts.map(o=>`<label class="option"><input type="radio" name="q${i}" value="${encodeURIComponent(o)}"> ${o}</label>`).join('');block.dataset.answer=q.answer;form.appendChild(block)});$('#submitQuiz').onclick=()=>gradeQuiz('Reading');}
function renderListening(area,u){
  const l=u.listening;
  const matchOptions = l.matching.options;
  area.innerHTML=`<p class="pill">Listening is in audio order: 5 MCQs + 5 matching + 5 ordering. Audio sequence is not shuffled.</p>
  <div class="audio-list">${(l.audio||[]).map((a,i)=>`<div class="audio-card"><strong>Script ${i+1}</strong><video controls src="assets/audio/${a}"></video></div>`).join('')}</div>
  <form id="listeningForm">
    <h3>Part 1: Multiple Choice</h3><div id="mcqBox"></div>
    <h3>Part 2: Matching</h3><p>Choose the correct answer for each item.</p><div id="matchingBox"></div>
    <h3>Part 3: Ordering</h3><p>Listen to Script 4. Put the events in the correct order by choosing 1–5.</p><div id="orderingBox"></div>
  </form><div class="actions"><button id="submitListening" type="button">Submit Listening</button></div><div id="result"></div>`;
  const mcqBox=$('#mcqBox');
  l.mcq.forEach((q,i)=>{const opts=shuffle(q.options);const block=document.createElement('div');block.className='question listen-mcq';block.dataset.answer=q.answer;block.innerHTML=`<h4>${i+1}. ${q.q}</h4>`+opts.map(o=>`<label class="option"><input type="radio" name="lmcq${i}" value="${encodeURIComponent(o)}"> ${o}</label>`).join('');mcqBox.appendChild(block)});
  const matchingBox=$('#matchingBox');
  l.matching.items.forEach((it,i)=>{const block=document.createElement('div');block.className='question matching-item';block.dataset.answer=it.answer;block.innerHTML=`<h4>${i+1}. ${it.prompt}</h4><select name="match${i}"><option value="">Choose...</option>${shuffle(matchOptions).map(o=>`<option value="${encodeURIComponent(o)}">${o}</option>`).join('')}</select>`;matchingBox.appendChild(block)});
  const orderingBox=$('#orderingBox');
  const events=shuffle(l.ordering.events.map((e,idx)=>({e,idx:idx+1})));
  events.forEach((ev,i)=>{const block=document.createElement('div');block.className='question order-item';block.dataset.answer=String(ev.idx);block.innerHTML=`<h4>${ev.e}</h4><select name="order${i}"><option value="">Position...</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>`;orderingBox.appendChild(block)});
  $('#submitListening').onclick=gradeListening;
}
function gradeListening(){
  let score=0,total=0;
  document.querySelectorAll('.listen-mcq').forEach((b,i)=>{total++;const chosen=document.querySelector(`input[name=lmcq${i}]:checked`);if(chosen&&decodeURIComponent(chosen.value)===b.dataset.answer)score++;});
  document.querySelectorAll('.matching-item').forEach((b,i)=>{total++;const chosen=document.querySelector(`select[name=match${i}]`);if(chosen&&decodeURIComponent(chosen.value)===b.dataset.answer)score++;});
  document.querySelectorAll('.order-item').forEach((b,i)=>{total++;const chosen=document.querySelector(`select[name=order${i}]`);if(chosen&&chosen.value===b.dataset.answer)score++;});
  $('#result').innerHTML=`<p class="score">Score: ${score}/${total}</p>`;saveResult('Listening',score,total);
}
function renderWriting(area,u){area.innerHTML=`<h3>Writing Task</h3><p class="reading-text">${u.writing}</p><div class="prompt-box"><strong>Prompts:</strong><ul>${(u.writingPrompts||[]).map(p=>`<li>${p}</li>`).join('')}</ul></div><p><strong>Word count:</strong> 70+ words for Elementary/A2. <strong>Duration:</strong> 30 minutes.</p><textarea id="writingText" class="writebox" placeholder="Write your answer here..."></textarea><div class="actions"><button id="saveWriting">Submit Writing</button></div><div id="result"></div>`;$('#saveWriting').onclick=()=>{const txt=$('#writingText').value.trim();const wc=txt?txt.split(/\s+/).length:0;$('#result').innerHTML=`<p class="score">Saved. Word count: ${wc}. ${wc>=70?'Length target achieved.':'Write at least 70 words.'}</p>`;saveResult('Writing',wc>=70?1:0,1,{wordCount:wc,text:txt});}}
function renderSpeaking(area,u){const title=u.speaking.p2Title||'Speaking card';area.innerHTML=`<h3>Speaking Test</h3><div class="speaking-card"><h4>Part 1: Interview Questions</h4><ol>${u.speaking.p1.map(q=>`<li>${q}</li>`).join('')}</ol><h4>Part 2: Long Turn / Card</h4><p><strong>${title}</strong></p><ul>${(u.speaking.p2Prompts||[]).slice(0,4).map(q=>`<li>${q}</li>`).join('')}</ul><p><strong>Preparation:</strong> 45 seconds. <strong>Speaking:</strong> at least 1 minute.</p><h4>Part 3: Extended Questions</h4><ol>${u.speaking.p3.map(q=>`<li>${q}</li>`).join('')}</ol></div><div class="actions"><button id="saveSpeaking">Mark Speaking Practice Complete</button></div><div id="result"></div>`;$('#saveSpeaking').onclick=()=>{saveResult('Speaking',1,1);$('#result').innerHTML='<p class="score">Speaking practice marked complete.</p>'};}
function saveResult(skill,score,total,extra={}){const record={time:new Date().toISOString(),student,unit:currentUnit.id,unitTitle:currentUnit.title,skill,score,total,...extra};let all=JSON.parse(localStorage.getItem('l3_results')||'[]');all.push(record);localStorage.setItem('l3_results',JSON.stringify(all));sendToSheets(record);}
function sendToSheets(record){if(!APPS_SCRIPT_URL)return;fetch(APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(record)}).catch(()=>{});}
function showProgress(){const all=JSON.parse(localStorage.getItem('l3_results')||'[]').filter(r=>!student.id||r.student.id===student.id);$('#progressBox').classList.toggle('hidden');$('#progressBox').innerHTML='<h2>Your Progress</h2>'+makeTable(all.slice(-30));}
function showTeacher(){const all=JSON.parse(localStorage.getItem('l3_results')||'[]');$('#teacherBox').classList.toggle('hidden');$('#teacherData').innerHTML=makeTable(all.slice(-100));}
function makeTable(rows){if(!rows.length)return '<p>No records yet.</p>';return `<table class="report-table"><tr><th>Time</th><th>Name</th><th>ID</th><th>Group</th><th>Unit</th><th>Skill</th><th>Score</th></tr>${rows.map(r=>`<tr><td>${new Date(r.time).toLocaleString()}</td><td>${r.student.name||''}</td><td>${r.student.id||''}</td><td>${r.student.group||''}</td><td>${r.unit}</td><td>${r.skill}</td><td>${r.score}/${r.total}</td></tr>`).join('')}</table>`}
init();
