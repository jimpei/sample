"use strict";

//Firebaseの初期化
firebase.initializeApp({
  databaseURL: "https://second-firebase-71178.firebaseio.com/"
});
const database = firebase.database();
const ref = database.ref("messages");
let last_message = "dummy";

//初期読み込み & pushイベント検知
ref.on("child_added", snapshot => {
  renderMessage({
    id: snapshot.key,
    value: snapshot.val()
  });
});

//インジェクション対策
const escapeHTML = val =>
  $("<div>")
    .text(val)
    .html();

//投稿処理
const postAction = () => {
  const content = escapeHTML($("#content").val());
  if (content && content !== "") {
    ref
      .push({
        title: "タイトル",
        content: content,
        date: new Date().getTime()
      })
      .then(res => {
        console.log(res);
      });
  }
  $("#content").val("");
};

//メッセージをDOM追加
const renderMessage = message => {
  const message_html = `<p class="post-text">${escapeHTML(
    message.value.content
  )}</p>`;
  let date_html = "";
  if (message.value.date) {
    date_html = `<p class="post-date">${escapeHTML(
      new Date(message.value.date).toLocaleString()
    )}</p>`;
  }
  $("#" + last_message).before(
    `<div id="${message.id}" class="post">${message_html}${date_html}</div>`
  );
  last_message = message.id;
};

//クリック時の処理
$("#post").click(() => postAction());
//エンターキータイプ時の処理
$("#content").keydown(e => {
  if (e.which == 13) {
    postAction();
    return false;
  }
});
