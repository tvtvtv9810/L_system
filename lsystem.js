// キャンバス
let canvas, context;
// 位置、角度
let x, y, angle;
// 位置、角度（保存用）
let point = new Array();
// ルール、回転角度、進行距離、ステップ数
let rule, a, d, num;
// ステップ、インデックス
let step, index;

// サンプルデータ
// > [初期状態、開始位置X、開始位置Y、開始角度、変換ルール、回転角度、進行距離、ステップ数]
sample =[
    ["F" ,  50, 400, 0, "F->F-F+F+F-F", 90, 20, 3],
    ["F" , 100, 500, 0, "F->F-F-F-ff, f->ff", 120, 50, 4],
    ["FA", 300, 300, 0, "A->A+BF, B->FA-B", 90, 5, 10],
    ["X" , 300, 600, -90, "X->F+[[X]-X]-F[-FX]+X, F->FF", 25, 5, 5]
];

const init = () => {
    // キャンバスの取得
    canvas = document.getElementById("image");
    context = canvas.getContext("2d");
    setSample(0);
}

const initPoint = () => {
    // 位置、角度の初期化
    x = Number(document.getElementById("x0").value);
    y = Number(document.getElementById("y0").value);
    angle = Number(document.getElementById("a0").value);
    point = [];
}

const startDraw = () => {
    // 初期化
    context.clearRect(0, 0, canvas.width, canvas.height);
    rule = document.getElementById("rule0").value.replace(/¥s+/g, ""); // 空白を削除
    a = Number(document.getElementById("a").value);
    d = Number(document.getElementById("d").value);
    num = Number(document.getElementById("num").value);

    initPoint();

    // ログ
    document.getElementById("log").value = `[0]\n${rule}`;

    [step, index] = [0, 0];

    if(document.getElementById("last").checked){
        for(let i=0; i<num; i++) {
            generate();
        }
    }
    // 描画
    draw();
}

const generate = () => {
    // ルールを生成
    let rules = document.getElementById("rules").value.replace(/¥s/g, "");
    rules = rules.split(",");

    // 「-＞」の前の文字列を　後の文字列　に置き換える
    for(let i=0; i<rules.length; i++) {
        rule = rule.replaceAll(rules[i].split("->")[0], `{${i}}`)
    }
    for(let i=0; i<rules.length; i++) {
        rule = rule.replaceAll(`{${i}}`, rules[i].split("->")[1])
    }
    step++;
    // ログ：ステップ数と現在の状態を表示
    document.getElementById("log").value += `\n[${step}]\n`;
    document.getElementById("log").value += rule;
}

const draw = () => {
    // ルールを反映
    const message = document.getElementById("message");
    let endCheck = false;
    if(index < rule.length){
        if(rule[index] == "F"){
            // 直線を描画
            const h = index/rule.length * 360;
            const x1 = x + d * Math.cos(angle * Math.PI/180);
            const y1 = y + d * Math.sin(angle * Math.PI/180);
            context.strokeStyle = `hsl(${h}, 100%, 75%)`; // HSL形式で色セット
            // 直線を描く
            context.beginPath();
            context.moveTo(x,y);
            context.lineTo(x1, y1);
            context.stroke();
            // 終点座標を保存
            [x,y] = [x1, y1];
        }else if(rule[index]=="f"){
            // 移動
            x = x + d * Math.cos(angle * Math.PI/180);
            y = y + d * Math.cos(angle * Math.PI/180);
        }else if(rule[index]=="+"){
            // 時計回りに回転
            angle += a;
        }else if(rule[index]=="-"){
            // 反時計回りに回転
            angle -= a;
        }else if(rule[index]=="["){
            // 位置、角度を保存
            point.push([x, y, angle]);
        }else if(rule[index]=="]"){
            // 保存した位置、角度に戻る
            [x, y, angle] = point.pop();
        }
        index++;
        message.innerText = `ステップ　${step}：${index}/${rule.length}`;
    }else{
        // 現在の状態のぶんの描画を終えたなら

        // 次のステップ／終了
        if(step<num){
            index = 0;
            generate();
            initPoint();
        }else{
            message.innerText += " 終了";
            endCheck = true;
        }
    }

    if(!endCheck){
        if(document.getElementById("hispeed").checked){
            // 高速描画
            if(index%1000 > 0){
                draw();
            }else{
                window.requestAnimationFrame(draw);
            }
        }else{
            window.requestAnimationFrame(draw);
        }
    }
}

const setSample = n => {
    // サンプルデータをセット
    document.getElementById("rule0").value = sample[n][0];
    document.getElementById("x0").value = sample[n][1];
    document.getElementById("y0").value = sample[n][2];
    document.getElementById("a0").value = sample[n][3];
    document.getElementById("rules").value = sample[n][4];
    document.getElementById("a").value = sample[n][5];
    document.getElementById("d").value = sample[n][6];
    document.getElementById("num").value = sample[n][7];
}