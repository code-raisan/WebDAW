const connect_alert = document.getElementById("connect_alert");
const connect_alert_msg = document.getElementById("connect_alert_msg");
const connect_alert_device = document.getElementById("connect_alert_device");
const device_list = document.getElementById("device_list");
const sun = document.getElementById("sun");
const clear = document.getElementById("clear");

if(!navigator.requestMIDIAccess){
    alert("Doesn't supported your browser");
}


/*function onMIDI(event){
    console.log(event);
	var str = '';
    for (var i = 0; i < event.data.length; i++) {
        str += event.data[i] + ':';
    }
	console.log(str);
}*/
let c = 0;
const onMIDI = (events) =>{
    console.log(events.data[1]);
    if(events.data[2] === 100){
        c++;
        const now = new Date();
        const hours = ("00" + now.getHours()).slice(-2);
        const minutes = ("00" + now.getMinutes()).slice(-2);
        const seconds = ("00" + now.getSeconds()).slice(-2);
        const hms = `${hours}:${minutes}:${seconds}`;
        const notes = {
            0: "ド",
            1: "ド#",
            2: "レ",
            3: "レ#",
            4: "ミ",
            5: "ファ",
            6: "ファ#",
            7: "ソ",
            8: "ソ#",
            9: "ラ",
            10: "ラ#",
            11: "シ"
        }
        const note = notes[events.data[1] % 12];
        const pElement = document.createElement("li");
        pElement.innerText = `${c}[${hms}] ${note}(${events.data[1]})`;
        pElement.className = "list-group-item";
        sun.insertBefore(pElement, sun.firstChild);
    }
}

navigator.requestMIDIAccess()
.then(MIDI =>{
    console.log("MIDI READY");
    const inputs = MIDI.inputs;
	inputs.forEach(function(key,port){
        if(key.state === "connected"){
            connect_alert_msg.innerText = "デバイスが接続されました";
            connect_alert.className = "alert alert-dismissible fade show alert-primary";
            connect_alert_device.style.display = "";
            const cElement = document.createElement("pre");
            cElement.innerText = `[ポート]${port}\n[デバイス名]${key.name}\n[製造元]${key.manufacturer}`;
            const pElement = document.createElement("li");
            pElement.appendChild(cElement)
            pElement.setAttribute("class", "list-group-item");
            device_list.appendChild(pElement);
            key.onmidimessage = onMIDI;
        }else{
            connect_alert.style.display = "block";
        }
	}); 
}, e =>{
    alert("MIDI FAILED: " + e);
});

clear.onclick = () =>{
    sun.innerText = "";
    c = 0;
}