class SellpiaDom {
  static document = document;

  constructor(tag_name, class_names, id, default_style) {
    this.dom = SellpiaDom.document.createElement(tag_name);
    this.addClass(class_names);
    if (id) {
      this.attrs({id: id});
    }
    if (default_style) {
      this.style(default_style);
    }
  }

  static txt_c(dom, class_name) {
    if (class_name) {
      if (dom instanceof this) {
        dom = new SellpiaDom("span", class_name).add(dom);
      } else {
        dom = new SellpiaDom("span", class_name).text(dom);
      }
    }
    if (dom instanceof this) {
      return (new this('div', 'txt-c')).add(dom);
    }
    return (new this('div', 'txt-c')).text(dom);
  }

  static div(class_name, id, default_style) {
    return new this('div', class_name, id, default_style);
  }

  static table(class_name, id, default_style) {
    return new this('table', class_name, id, default_style);
  }

  static tr(class_name, id, default_style) {
    return new this('tr', class_name, id, default_style);
  }

  static td(class_name, id, default_style) {
    return new this('td', class_name, id, default_style);
  }

  static th(class_name, id, default_style) {
    return new this('th', class_name, id, default_style);
  }

  static a(class_name, href) {
    return (new this('a', class_name)).attrs({href: href});
  }

  static th_c(doms) {
    return (new this('th')).attrs({"scope": "col"}).add(doms);
  }

  static strong(str) {
    return new this("strong").text(str);
  }

  static span(str, class_name) {
    return new this("span", class_name).text(str);
  }

  static attachBody(dom, shadow) {
    this.attach(document.getElementsByTagName("body")[0], dom, shadow, 2000);
  }

  static attach(body, dom, shadow, index) {
    body.appendChild(shadow.dom);
    shadow.dom.style.zIndex = index;
    shadow.dom.attachShadow({mode: 'open'}).appendChild(dom.dom); // shadow root 는 document 에 attend 한 뒤에 정의 가능
  }

  static preAttach(body, dom, shadow, index) {
    body.prepend(shadow.dom);
    shadow.dom.style.zIndex = index;
    shadow.dom.attachShadow({mode: 'open'}).appendChild(dom.dom); // shadow root 는 document 에 attend 한 뒤에 정의 가능
  }

  static script(src) {
    let dom = new this("script");
    dom.dom.src = src;
    dom.dom.async = true;
    return dom;
  }

  static style(src) {
    let dom = new this('link');
    // if (typeof load_callback === "function") {
    //     dom.dom.addEventListener("load", load_callback)
    // }
    dom.attrs({
      type:"text/css",
      rel:"stylesheet",
      href:src,
    });
    return dom;
  }

  static stylePromise(src) {
    return new Promise((resolved, reject)=>{
      let preload = new this('link');
      let dom = new this('link');

      preload.dom.addEventListener("load", ()=>{
        resolved(dom);
      })
      preload.dom.href = src;
      preload.dom.rel = "preload";
      preload.dom.as = "style";

      dom.attrs({
        type:"text/css",
        rel:"stylesheet",
        href:src,
      });
      if(!document.querySelector("head")?.appendChild(preload.dom)) {
        console.log('Makeshop Stock : head not found');
        resolve(dom); // head 못 찾은 경우 그냥 resolve
      }
    })
  }


  /**
   * @TODO Array 로 작동 하는 기능은 제거 예정
   * @param doms
   * @returns {SellpiaDom}
   */
  add(doms) {
    if (!(doms instanceof Array)) {
      doms = [doms];
    }
    return this.adds(doms);
  }

  adds(doms) {
    doms.map(dom => {
      if (dom === undefined || dom === false || dom === null) return;
      this.dom.appendChild(dom.dom);
    });
    return this;
  }

  text(str) {
    this.dom.innerText = str;
    return this;
  }

  html(str) {
    this.dom.innerHTML = str;
    return this;
  }

  style(str) {
    if (str) {
      this.dom.style.cssText = str;
    }
    return this;
  }

  attrs(attrs) {
    let keys = Object.keys(attrs);
    keys.map(key => {
      this.dom.setAttribute(key, attrs[key]);
    })
    return this;
  }

  hide() {
    this.dom.style.display = "none";
    return this;
  }

  show() {
    this.dom.style.display = "";
    return this;
  }

  addClass(class_names) {
    if (class_names) {
      let temp_class_name;
      if (class_names instanceof Array) {
        temp_class_name = class_names;
      } else if (class_names.split) {
        temp_class_name = class_names.split(" ");
      } else {
        temp_class_name = [class_names];
      }
      temp_class_name.map(class_name => {
        this.dom.classList.add(class_name);
      })
    }
    return this;
  }

  removeClass(class_name) {
    if (class_name) {
      this.dom.classList.remove(class_name);
    }
  }

  event(event, callback) {
    this.dom.addEventListener(event, callback);
    return this;
  }

  click(callback) {
    return this.event("click", callback);
  }
}


export default SellpiaDom