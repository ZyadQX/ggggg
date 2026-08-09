const $=id=>document.getElementById(id);
const screens=["lobby","createScreen","waiting","joinScreen","game"];
const state={round:1,total:5,limit:60,code:"",myChoice:"",oppChoice:"بطيخ",timer:null};

function show(id){screens.forEach(x=>$(x).classList.toggle("active",x===id));scrollTo(0,0)}
function toast(t){const e=$("toast");e.textContent=t;e.classList.remove("hide");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.add("hide"),2200)}
function code(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function emoji(v){v=v.toLowerCase();if(v.includes("بطيخ")||v.includes("watermelon"))return"🍉";if(v.includes("تفاح")||v.includes("apple"))return"🍎";if(v.includes("قطة")||v.includes("cat"))return"🐱";if(v.includes("كلب")||v.includes("dog"))return"🐶";if(v.includes("كرة")||v.includes("ball"))return"⚽";if(v.includes("بيتزا")||v.includes("pizza"))return"🍕";return"🖼️"}

const rooms=[
["A7K2P9","تحدي الأبطال","Ahmed"],["M4Q8Z1","ألغاز سريعة","Mazen"],["B2X6K4","مين يعرف؟","Omar"]
];
$("rooms").innerHTML=rooms.map(r=>`<div class="room"><div>🎮 <b>${r[1]}</b><small>${r[2]} • 1/2 لاعبين</small></div><button data-code="${r[0]}">دخول</button></div>`).join("");
document.querySelectorAll(".room button").forEach(b=>b.onclick=()=>{$("joinCode").value=b.dataset.code;show("joinScreen")});

$("create").onclick=()=>show("createScreen");$("join").onclick=()=>show("joinScreen");$("back").onclick=()=>show("lobby");
$("cancelCreate").onclick=()=>show("lobby");$("cancelJoin").onclick=()=>show("lobby");$("leave").onclick=()=>show("lobby");

$("make").onclick=()=>{
 state.code=code();state.total=+$("rounds").value;state.limit=+$("limit").value;
 $("code").textContent=state.code;$("start").disabled=true;show("waiting");
 setTimeout(()=>{$("oppWait").textContent="Player Two";$("waitStatus").textContent="● الخصم دخل الغرفة";$("start").disabled=false},1200);
};
$("copy").onclick=()=>navigator.clipboard?.writeText(state.code).then(()=>toast("تم نسخ الكود 📋"));
$("start").onclick=startGame;

$("joinBtn").onclick=()=>{
 const c=$("joinCode").value.trim().toUpperCase();
 if(!/^[A-Z0-9]{6}$/.test(c)){$("joinError").textContent="كود الغرفة يجب أن يكون 6 حروف أو أرقام.";return}
 $("joinError").textContent="";state.code=c;show("waiting");$("start").disabled=true;$("waitStatus").textContent="● دخلت الغرفة — في انتظار المضيف";$("oppWait").textContent="Player One";
};

function startGame(){
 state.round=1;state.myChoice="";$("round").textContent=1;$("total").textContent=state.total;
 $("myAvatar").textContent="?";$("myAvatar").classList.add("mystery");$("oppAvatar").textContent="?";$("oppAvatar").classList.add("mystery");
 $("choice").value="";$("guessInput").value="";$("feedback").textContent="";show("game");timer();
}
function timer(){clearInterval(state.timer);state.timeLeft=state.limit;$("timer").textContent=state.timeLeft;state.timer=setInterval(()=>{--state.timeLeft;$("timer").textContent=state.timeLeft;if(state.timeLeft<=0){clearInterval(state.timer);toast("انتهى الدور ⏰");nextRound()}},1000)}

$("confirm").onclick=()=>{
 const v=$("choice").value.trim();if(v.length<2){toast("اكتب اسم الصورة أولًا ✍️");return}
 state.myChoice=v;$("myAvatar").classList.remove("mystery");$("myAvatar").textContent=emoji(v);$("oppState").textContent="الخصم جاهز للتخمين...";
 toast("تم اختيار صورتك 🔒");
};

$("guess").onclick=()=>$("guessInput").focus();
$("sendGuess").onclick=guess;
$("guessInput").onkeydown=e=>{if(e.key==="Enter")guess()};
function guess(){
 const v=$("guessInput").value.trim();if(v.length<2){$("feedback").style.color="var(--red)";$("feedback").textContent="اكتب التخمين أولًا.";return}
 $("feedback").style.color="var(--g)";$("feedback").textContent="تم إرسال التخمين ✓";
 $("oppNotice").textContent=`الخصم قام بالتخمين: ${v} 👀`;$("oppNotice").classList.remove("hide");
 $("oppState").textContent=`الخصم خمّن: ${v}`;toast("الخصم عرف أنك قمت بالتخمين 👀");
 if(v.toLowerCase()===state.oppChoice.toLowerCase())setTimeout(()=>win("أنت فزت! 🏆","عرفت صورة الخصم بشكل صحيح."),700);
 else setTimeout(()=>toast("التخمين غير صحيح ❌"),700);
}

$("chat").onclick=()=>open("chatModal");$("questions").onclick=()=>open("qModal");
$("sendChat").onclick=()=>{const v=$("chatInput").value.trim();if(!v)return;const e=document.createElement("div");e.className="msg me";e.textContent=v;$("messages").appendChild(e);$("chatInput").value=""};
document.querySelectorAll(".close").forEach(b=>b.onclick=()=>close(b.dataset.close));
function open(id){$(id).classList.remove("hide")}function close(id){$(id).classList.add("hide")}

const qs=["هل هو شيء يؤكل؟","هل هو حيوان؟","هل له لون أحمر؟","هل يمكن استخدامه داخل المنزل؟","هل نستخدمه يوميًا؟","هل يمكن شربه؟","هل هو أكبر من الإنسان؟","هل يوجد في الشارع؟"];
$("questionList").innerHTML=qs.map(q=>`<button class="question">${q}</button>`).join("");
document.querySelectorAll(".question").forEach(b=>b.onclick=()=>{close("qModal");$("questionText").textContent=b.textContent;open("answerModal")});
document.querySelectorAll(".answers button").forEach(b=>b.onclick=()=>{close("answerModal");toast("تم إرسال الإجابة: "+b.dataset.a+" ✓")});

["mic","sound"].forEach(id=>$(id).onclick=()=>{$(id).classList.toggle("on");toast($(id).classList.contains("on")?"تم التشغيل":"تم الإيقاف")});

function win(title,text){
 clearInterval(state.timer);$("resultTitle").textContent=title;$("resultText").textContent=text;$("resultPic").textContent=emoji(state.oppChoice);
 $("next").textContent=state.round<state.total?"ابدأ الدور التالي":"إنهاء المباراة";open("result");toast("🎉 نتيجة صحيحة!");
}
$("next").onclick=()=>{close("result");if(state.round<state.total)nextRound();else show("lobby")};
$("home").onclick=()=>{close("result");show("lobby")};

function nextRound(){
 state.round++;if(state.round>state.total){show("lobby");return}
 $("round").textContent=state.round;$("myAvatar").textContent="?";$("myAvatar").classList.add("mystery");$("oppAvatar").textContent="?";$("oppAvatar").classList.add("mystery");
 $("choice").value="";$("guessInput").value="";$("feedback").textContent="";$("oppNotice").classList.add("hide");$("turn").textContent="دورك الآن 🎯";
 toast("بدأ دور جديد 🔄");timer();
}
