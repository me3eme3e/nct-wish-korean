const STORE="korean-note-local-v1";
const initial={words:["설레다"],done:[],notes:"",memberNotes:{},streak:0,lastDay:""};
let data=read(),selectedMember="시온";
function read(){try{return {...initial,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return {...initial}}}
function save(){localStorage.setItem(STORE,JSON.stringify(data));stats();vocab()}
function stats(){document.querySelector("#wordCount").textContent=data.words.length;document.querySelector("#doneCount").textContent=data.done.length}
function page(id){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll(".bottom button").forEach(x=>x.classList.toggle("selected",x.dataset.page===id));if(id==="vocabulary")vocab();window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",e=>{let b=e.target.closest("[data-page]");if(b)page(b.dataset.page)});
function addWord(w){if(!data.words.includes(w)){data.words.push(w);save();alert("単語帳に保存しました！")}else alert("保存済みの単語です。")}
document.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>addWord(b.dataset.save));
document.querySelectorAll("[data-done]").forEach(b=>b.onclick=()=>{if(!data.done.includes(b.dataset.done)){data.done.push(b.dataset.done);save()}b.textContent="✓ 学習済み"});
function vocab(){let el=document.querySelector("#vocabList");if(!el)return;el.innerHTML=data.words.length?data.words.map((w,i)=>`<div class="vocab-item"><div><b>${escapeHTML(w)}</b><small>${({설레다:"わくわくする・胸がときめく",함께:"一緒に"})[w]||"自分で保存した単語"}</small></div><button data-remove="${i}">削除</button></div>`).join(""):"<p>まだ単語がありません。教材から単語を保存しましょう。</p>";el.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{data.words.splice(+b.dataset.remove,1);save()})}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelector("#explain").onclick=()=>{let x=document.querySelector("#explanation");x.hidden=!x.hidden};
document.querySelector("#saveNote").onclick=()=>{data.notes=document.querySelector("#videoNote").value;save();document.querySelector("#noteStatus").textContent="このiPadに保存しました。"};
const names=["シオン","リク","ユウシ","ジェヒ","リョウ","サクヤ"];
document.querySelector("#members").innerHTML=names.map(n=>`<button class="member" data-member="${n}"><b>${n}</b><small>個人学習ノート</small></button>`).join("");
function chooseMember(n){selectedMember=n;document.querySelectorAll(".member").forEach(b=>b.classList.toggle("selected",b.dataset.member===n));document.querySelector("#memberNote").value=data.memberNotes[n]||"";document.querySelector("#memberPanel h2").textContent=n}
document.querySelectorAll("[data-member]").forEach(b=>b.onclick=()=>chooseMember(b.dataset.member));
document.querySelector("#saveMemberNote").onclick=()=>{data.memberNotes[selectedMember]=document.querySelector("#memberNote").value;save();alert("メモを保存しました。")};
document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{document.querySelector("#result").textContent=b.dataset.answer==="A"?"正解！ 부담스럽다 は「負担に感じる」という意味です。":"もう一度！正解は A. 負担に感じる です。"});
document.querySelector("#export").onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="korean-note-backup.json";a.click();URL.revokeObjectURL(a.href)};
document.querySelector("#import").onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());data={...initial,...obj};save();alert("バックアップを読み込みました。")}catch{alert("読み込めないファイルです。")}};
document.querySelector("#videoNote").value=data.notes||"";
stats();vocab();if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
let deferred;const install=document.querySelector("#install");window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;install.hidden=false});install?.addEventListener("click",async()=>{if(deferred){deferred.prompt();deferred=null}});
