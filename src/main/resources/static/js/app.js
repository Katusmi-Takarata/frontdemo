// 共通ユーティリティ
const toAbsoluteUrl = (u) => new URL(u, window.location.origin).href;

// モードレスウィンドウを開いてサーバ連携
function modelessWindow() {
  // ① ユーザー操作直後に window.open
  const target = '_testList';
  const modal = window.open('about:blank', target, 'width=1280,height=1080');

  // ② Ajax用リクエスト
  const requestBody = collectValuesById('name', 'sex');

  // ルート相対URLに統一（/test1）
  ajaxPost(
    '/test1',
    requestBody, function (response) {
      // ③ 別ウィンドウへ POST するパラメータ
      const param = {
        testList: JSON.stringify(response),
      };
      // POST 先もルート相対に統一（/test2）
      postToWindow('/test2', param, target);
    },
    function () {
      modal.close();
      alert('エラー');
    }
  );
}

// 指定した要素IDから value を収集してオブジェクト化
function collectValuesById(...elementIds) {
  const values = {};

  for (const id of elementIds) {
    const element = document.getElementById(id);
    values[id] = element?.value ?? '';
  }
  return values;
}

// JSON POST (fetch)
function ajaxPost(url, data, onSuccess, onError) {
  const abs = toAbsoluteUrl(url);
  fetch(abs, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP error');
      return res.json();
    })
    .then(onSuccess)
    .catch((err) => {
      if (onError) onError(err);
    });
}

// 別ウィンドウ（ターゲット）へフォームPOST
function postToWindow(url, params, targetName) {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = toAbsoluteUrl(url);
  form.target = targetName;

  Object.keys(params).forEach(function (name) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = params[name];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
