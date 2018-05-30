const data = [
  {
    appID: 609320,
    appTitle: "FAR: Lone Sails",
    reviewSummaryRank: "positive",
    releaseDate: "2018年5月17日",
    price: 50,
    platforms: ["win", "mac"],
    tags: ["动作", "冒险", "设计与插画", "独立", "驾驶"],
    addedDate: "2018/5/21"
  },
  {
    appID: 481510,
    appTitle: "Night in the Woods",
    reviewSummaryRank: "positive",
    releaseDate: "2017年2月22日",
    price: 68,
    platforms: ["win", "mac", "linux"],
    tags: ["冒险", "独立", "平台", "剧情丰富", "好评原声音乐"],
    addedDate: "2018/5/26"
  },
  {
    appID: 367520,
    appTitle: "Hollow Knight",
    reviewSummaryRank: "positive",
    releaseDate: "2017年2月25日",
    price: 48,
    platforms: ["win", "mac", "linux"],
    tags: ["动作", "冒险", "独立", "平台", "类银河战士恶魔城"],
    addedDate: "2017/11/26"
  },
  {
    appID: 260230,
    appTitle: "Valiant Hearts: The Great War™ / Soldats Inconnus : Mémoires de la Grande Guerre™",
    reviewSummaryRank: "positive",
    releaseDate: "2014年6月26日",
    price: 68,
    platforms: ["win"],
    tags: ["动作", "冒险", "教育", "平台", "解谜"],
    addedDate: "2018/5/18"
  },
  {
    appID: 609490,
    appTitle: "Minit",
    reviewSummaryRank: "positive",
    releaseDate: "2018年4月3日",
    price: 36,
    platforms: ["win", "mac", "linux"],
    tags: ["冒险", "角色扮演", "独立", "好评原声音乐", "画素风格"],
    addedDate: "2018/5/12"
  }
];

/* generate wishlist rows */
const wishlist = $(".wishlist_ctn");
data.forEach((app, index) => wishlist.append(createWishlishRowHtml(app, index)));

const apps = $(".wishlist_row");
const handles = apps.find(".hover_handle");
const state = {
  appsOrder: [],
  isSorting: false,
  target: null,
  targetIndex: undefined,
  originPageY: undefined,
  originToTop: undefined
};
apps.each(function() { state.appsOrder.push($(this)); });

updateAppsProperties();
updateWishlistHeight();
addDragEventListener();
handleSetTop();
handleOrderInput();

function createPlatformSymbolsHtml(platforms) {
  let html = "";
  for (let i = 0; i < platforms.length; i++) {
    html += `<span class="platform_img ${platforms[i]}"></span>`
  }
  return html;
}

function createTagsHtml(tags) {
  let html = "";
  for (let i = 0; i < tags.length; i++) {
    html += `<div class="tag">${tags[i]}</div>`
  }
  return html;
}

function extractData(source, index) {
  const reviewSummaryTable = {
    positive: "特别好评"
  }

  return {
    order: index,
    appID: source.appID,
    appTitle: source.appTitle,
    reviewSummaryRank: source.reviewSummaryRank,
    reviewSummaryDescription: reviewSummaryTable[source.reviewSummaryRank],
    releaseDate: source.releaseDate,
    price: source.price,
    platformSymbols: createPlatformSymbolsHtml(source.platforms),
    tags: createTagsHtml(source.tags),
    addedDate: source.addedDate
  }
}

function createWishlishRowHtml(source, index) {
  const data = extractData(source, index);

  const template = 
  `<div class="wishlist_row">
    <div class="hover_handle" data-order="${data.order}">
      <span class="set_top">置顶</span>
      <img class="handle" src="./asset/icons/handle.png" draggable="false">
      <input class="order_input" type="text">
    </div>
    <a class="capsule" href="https://store.steampowered.com/app/${data.appID}">
      <img src="https://steamcdn-a.akamaihd.net/steam/apps/${data.appID}/header.jpg">
    </a>
    <div class="content">
      <a class="title" href="https://store.steampowered.com/app/${data.appID}">${data.appTitle}</a>
      <div class="mid_ctn">
        <div class="stats">
          <div class="label">总体评测：</div>
          <div class="value game_review_summary ${data.reviewSummaryRank}">${data.reviewSummaryDescription}</div>
          <div class="label">发行日期：</div>
          <div class="value release_date">${data.releaseDate}</div>
        </div>
        <div class="purchase_ctn">
          <div class="price">¥ ${data.price}</div>
          <a class="add_to_cart_btn" href="#">添加至购物车</a>
        </div>
      </div>
      <div class="platform_ctn">
        ${data.platformSymbols}
      </div>
      <div class="lower_ctn">
        <div class="tags">
          ${data.tags}
        </div>
        <div class="addedon"><span>添加日期：${data.addedDate}（<a class="delete" href="#">移除</a>）</span></div>
      </div>
    </div>
  </div>`;

  return template;
}

function updateWishlistHeight() {
  wishlist.css("height", `${data.length * 180}px`);
}

function addDragEventListener() {
  handles.on("mousedown", function(e) {
    if (e.target.className !== "set_top" && e.target.className !== "order_input") {
      wishlist.addClass("sorting");
      state.isSorting = true;
      state.target = $(this).parent();
      state.target.css("transition", "top 0ms");
      state.target.css("z-index", "100");
      state.targetIndex = Number.parseInt($(this).attr("data-order"));
      state.originPageY = e.pageY;
      state.originToTop = state.targetIndex * 180;
    }
  });

  $(document).on("mousemove", function (e) {
    if (state.isSorting) {
      /* Make it move */
      const distance = e.pageY - state.originPageY;
      state.target.css("top", `${state.originToTop + distance}px`);

      const enterIndex = Math.floor((e.pageY - wishlist[0].offsetTop) / 180);
      if (enterIndex !== state.targetIndex && enterIndex >= 0 && enterIndex < state.appsOrder.length) {
        const enteredApp = state.appsOrder[enterIndex];
        enteredApp.css("top", `${state.targetIndex * 180}px`);

        [state.appsOrder[enterIndex], state.appsOrder[state.targetIndex]] = [state.appsOrder[state.targetIndex], state.appsOrder[enterIndex]];
        updateAppsProperties(false);
        state.targetIndex = enterIndex;
      }
    }
  });

  $(document).on("mouseup", function (e) {
    if (state.isSorting) {
      wishlist.removeClass("sorting");
      state.isSorting = false;
      state.target.css("transition", "");
      state.target.css("z-index", "");
      state.target.css("top", `${state.targetIndex * 180}px`);
    }
  });
}

function handleSetTop() {
  handles.find(".set_top").on("click", function() {
    const currentIndex = $(this).parent().attr("data-order");
    const currentRow = state.appsOrder[currentIndex];

    for (let i = currentIndex - 1; i >= 0; i--) {
      state.appsOrder[i + 1] = state.appsOrder[i];
    }
    state.appsOrder[0] = currentRow;

    updateAppsProperties();
  });
}

function handleOrderInput() {
  handles.find(".order_input").on("keydown", function(e) {
    /* press enter */
    if (e.which === 13) {
      const targetNum = Number.parseInt($(this).val());
      if (!Number.isNaN(targetNum) && targetNum >= 1) {
        const currentIndex = $(this).parent().attr("data-order");
        const currentRow = state.appsOrder[currentIndex];

        if (targetNum >= state.appsOrder.length) {
          state.appsOrder.splice(currentIndex, 1);
          state.appsOrder.push(currentRow);
        } else {
          const targetIndex = targetNum - 1;
          state.appsOrder.splice(currentIndex, 1);
          state.appsOrder.splice(targetIndex, 0, currentRow);
        }
        updateAppsProperties();
      }
    }
  });
}

function updateAppsProperties(isUpdatePosition = true) {
  state.appsOrder.forEach((app, index) => {
    app.find(".hover_handle").attr("data-order", index);
    app.find(".order_input").val(index + 1);
    if (isUpdatePosition) { app.css("top", `${index * 180}px`); }
  });
}