/*
  STICKYBITS 💉
  --------
  > a lightweight alternative to `position: sticky` polyfills 🍬
  --------
  - each method is documented above it our view the readme
  - Stickybits does not manage polymorphic functionality (position like properties)
  * polymorphic functionality: (in the context of describing Stickybits)
    means making things like `position: sticky` be loosely supported with position fixed.
    It also means that features like `useStickyClasses` takes on styles like `position: fixed`.
  --------
  defaults 🔌
  --------
  - version = `package.json` version
  - userAgent = viewer browser agent
  - target = DOM element selector
  - noStyles = boolean
  - offset = number
  - parentClass = 'string'
  - scrollEl = window || DOM element selector || DOM element
  - stickyClass = 'string'
  - stuckClass = 'string'
  - useStickyClasses = boolean
  - useFixed = boolean
  - useGetBoundingClientRect = boolean
  - verticalPosition = 'string'
  --------
  props🔌
  --------
  - p = props {object}
  --------
  instance note
  --------
  - stickybits parent methods return this
  - stickybits instance methods return an instance item
  --------
  nomenclature
  --------
  - target => el => e
  - props => o || p
  - instance => item => it
  --------
  methods
  --------
  - .definePosition = defines sticky or fixed
  - .addInstance = an array of objects for each Stickybits Target
  - .getClosestParent = gets the parent for non-window scroll
  - .getTopPosition = gets the element top pixel position from the viewport
  - .computeScrollOffsets = computes scroll position
  - .toggleClasses = older browser toggler
  - .manageState = manages sticky state
  - .removeClass = older browser support class remover
  - .removeInstance = removes an instance
  - .cleanup = removes all Stickybits instances and cleans up dom from stickybits
*/

function insertAfter(newElement, targetElement){
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
      // 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
  } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
      //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
  }
}

class Stickybits {
  constructor(target, obj) {
    const o = typeof obj !== 'undefined' ? obj : {};
    this.version = 'VERSION';
    this.userAgent = window.navigator.userAgent || 'no `userAgent` provided by the browser';
    this.props = {
      customStickyChangeNumber: o.customStickyChangeNumber || null,
      noStyles: o.noStyles || false,
      stickyBitStickyOffset: o.stickyBitStickyOffset || 0,
      parentClass: o.parentClass || 'js-stickybit-parent',
      scrollEl: typeof o.scrollEl === 'string' ? document.querySelector(o.scrollEl) : o.scrollEl || window,
      stickyClass: o.stickyClass || 'js-is-sticky',
      stuckClass: o.stuckClass || 'js-is-stuck',
      stickyChangeClass: o.stickyChangeClass || 'js-is-sticky--change',
      useStickyClasses: o.useStickyClasses || false,
      useFixed: o.useFixed || false,
      useGetBoundingClientRect: o.useGetBoundingClientRect || false,
      verticalPosition: o.verticalPosition || 'top',
    };
    /*
      define positionVal after the setting of props, because definePosition looks at the props.useFixed
      ----
      -  uses a computed (`.definePosition()`)
      -  defined the position
    */
    this.props.positionVal = this.definePosition() || 'fixed';

    this.instances = [];

    const {
      positionVal,
      verticalPosition,
      noStyles,
      stickyBitStickyOffset,
    } = this.props;
    const verticalPositionStyle = verticalPosition === 'top' && !noStyles ? `${stickyBitStickyOffset}px` : '';
    const positionStyle = positionVal !== 'fixed' ? positionVal : '';

    this.els = typeof target === 'string' ? document.querySelectorAll(target) : target;

    if (!('length' in this.els)) this.els = [this.els];

    for (let i = 0; i < this.els.length; i++) {
      const el = this.els[i];

      // set vertical position
      el.style[verticalPosition] = verticalPositionStyle;
      el.style.position = positionStyle;

      // instances are an array of objects
      this.instances.push(this.addInstance(el, this.props));
    }
  }

  /*
    setStickyPosition ✔️
    --------
    —  most basic thing stickybits does
    => checks to see if position sticky is supported
    => defined the position to be used
    => stickybits works accordingly
  */
  definePosition() {
    let stickyProp;
    if (this.props.useFixed) {
      stickyProp = 'fixed';
    } else {
      const prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
      const test = document.head.style;
      for (let i = 0; i < prefix.length; i += 1) {
        test.position = `${prefix[i]}sticky`;
      }
      stickyProp = test.position ? test.position : 'fixed';
      test.position = '';
    }
    return stickyProp;
  }

  /*
    addInstance ✔️
    --------
    — manages instances of items
    - takes in an el and props
    - returns an item object
    ---
    - target = el
    - o = {object} = props
      - scrollEl = 'string' | object
      - verticalPosition = number
      - off = boolean
      - parentClass = 'string'
      - stickyClass = 'string'
      - stuckClass = 'string'
    ---
    - defined later
      - parent = dom element
      - state = 'string'
      - offset = number
      - stickyStart = number
      - stickyStop = number
    - returns an instance object
  */
  addInstance(el, props) {
    const item = {
      el,
      parent: el.parentNode,
      props,
    };
    if (props.positionVal === 'fixed' || props.useStickyClasses) {
      if(!item.temp) {
        let temp = document.createElement('div');
        temp.style.height = `${item.el.offsetHeight}px`;
        temp.style.display = 'none';
        item.temp = temp;
        // it.el.parentNode.insertBefore(temp,it.el);
        insertAfter(temp,item.el)
      }
      this.isWin = this.props.scrollEl === window;
      const se = this.isWin ? window : this.getClosestParent(item.el, item.props.scrollEl);
      this.computeScrollOffsets(item);
      item.parent.className += ` ${props.parentClass}`;
      item.state = 'default';
      item.stateContainer = () => this.manageState(item);
      se.addEventListener('scroll', item.stateContainer);
    }
    return item;
  }

  /*
    --------
    getParent 👨‍
    --------
    - a helper function that gets the target element's parent selected el
    - only used for non `window` scroll elements
    - supports older browsers
  */
  getClosestParent(el, match) {
    // p = parent element
    const p = match;
    let e = el;
    if (e.parentElement === p) return p;
    // traverse up the dom tree until we get to the parent
    while (e.parentElement !== p) e = e.parentElement;
    // return parent element
    return p;
  }

  /*
    --------
    getTopPosition
    --------
    - a helper function that gets the topPosition of a Stickybit element
    - from the top level of the DOM
  */
  getTopPosition(el) {
    // debugger
    if (this.props.useGetBoundingClientRect) {
      return el.getBoundingClientRect().top + (this.props.scrollEl.pageYOffset || document.documentElement.scrollTop);
    }
    let topPosition = 0;
    do {
      topPosition = el.offsetTop + topPosition;
    } while ((el = el.offsetParent));
    return topPosition;
  }

  /*
    computeScrollOffsets 📊
    ---
    computeScrollOffsets for Stickybits
    - defines
      - offset
      - start
      - stop
  */

  computeScrollOffsets(item) {
    const it = item;
    const p = it.props;
    const el = it.el;
    const parent = it.parent;
    const isCustom = !this.isWin && p.positionVal === 'fixed';
    const isFixed = p.positionVal === 'fixed'
    const isNotWin = !this.isWin;
    const isTop = p.verticalPosition !== 'bottom';
    const scrollElOffset = isCustom ? this.getTopPosition(p.scrollEl) : 0;
    let stickyStart;
    if(isNotWin) {
      stickyStart = it.el.offsetTop
    } else {
      stickyStart = this.getTopPosition(el)
    }
    if(isNotWin) {
      stickyStart += parent.offsetTop
    }
    console.log(it.el.offsetTop, parent.offsetTop, stickyStart)
    // let stickyStart = isCustom
    //   ? this.getTopPosition(parent)
    //   : this.getTopPosition(parent);
    // if(isNotWin && !isCustom) {
    //   stickyStart = stickyStart - this.getTopPosition(p.scrollEl) + it.el.offsetTop
    // }
    // if(isCustom) {
    //   stickyStart = stickyStart + it.el.offsetTop
    // }
    // if(this.isWin) {
    //   stickyStart = stickyStart + it.el.offsetTop
    // }
    const stickyChangeOffset = p.customStickyChangeNumber !== null
      ? p.customStickyChangeNumber
      : el.offsetHeight;
    let parentBottom = stickyStart + parent.scrollHeight;
    // if(isFixed) {
    //   parentBottom  -= el.offsetHeight;
    // }
    if(isCustom) {
      parentBottom = parent.offsetTop + parent.scrollHeight
    }
    if(isNotWin && !isCustom) {
      parentBottom = parent.offsetTop + parent.scrollHeight
    }
    // it.offset = scrollElOffset + p.stickyBitStickyOffset;
    it.offset = p.stickyBitStickyOffset;
    it.stickyStart = isTop ? stickyStart - it.offset : 0;
    // it.stickyChange = it.stickyStart + stickyChangeOffset;
    it.stickyChange = it.stickyStart + stickyChangeOffset;
    
    it.stickyStop = isTop
      ? parentBottom - (el.offsetHeight + it.offset)
      : parentBottom - window.innerHeight;
  }

  /*
    toggleClasses ⚖️
    ---
    toggles classes (for older browser support)
    r = removed class
    a = added class
  */
  toggleClasses(el, r, a) {
    console.log(r, a)
    const e = el;
    const cArray = e.className.split(' ');
    if (a && cArray.indexOf(a) === -1) cArray.push(a);
    const rItem = cArray.indexOf(r);
    if (rItem !== -1) cArray.splice(rItem, 1);
    e.className = cArray.join(' ');
  }

  /*
    manageState 📝
    ---
    - defines the state
      - normal
      - sticky
      - stuck
  */
  manageState(item) {
    // cache object
    const it = item;
    const e = it.el;
    const p = it.props;
    const state = it.state;
    const start = it.stickyStart;
    const change = it.stickyChange;
    const stop = it.stickyStop;
    const stl = e.style;
    // cache props
    const ns = p.noStyles;
    const pv = p.positionVal;
    const se = p.scrollEl;
    const sticky = p.stickyClass;
    const stickyChange = p.stickyChangeClass;
    const stuck = p.stuckClass;
    const vp = p.verticalPosition;
    const isTop = vp !== 'bottom';
    /*
      requestAnimationFrame
      ---
      - use rAF
      - or stub rAF
    */
    const rAFStub = function rAFDummy(f) { f(); };
    const rAF = !this.isWin
      ? rAFStub
      : window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || rAFStub;

    /*
      define scroll vars
      ---
      - scroll
      - notSticky
      - isSticky
      - isStuck
    */
    const tC = this.toggleClasses;
    const scroll = this.isWin ? (window.scrollY || window.pageYOffset) : se.scrollTop;
    console.log('scroll: ', scroll, 'start: ', start, 'stop: ', stop)
    const notSticky = scroll > start && scroll < stop && (state === 'default' || state === 'stuck');
    const isSticky = isTop && scroll <= start && (state === 'sticky' || state === 'stuck');
    const isStuck = scroll >= stop && state === 'sticky';
    console.log('notSticky: ', notSticky, 'isSticky: ', isSticky, 'isStuck: ', isStuck)
    /*
      Unnamed arrow functions within this block
      ---
      - help wanted or discussion
      - view test.stickybits.js
        - `stickybits .manageState  `position: fixed` interface` for more awareness 👀
    */
    if (notSticky) {
      it.state = 'sticky';
      rAF(() => {
        if (pv === 'fixed') {
          // debugger
          if(item.temp) {
            item.temp.style.display = 'block';
          }
          // stl[vp] = `${p.stickyBitStickyOffset + this.getTopPosition(p.scrollEl)}px`;
          // oxw: 脱离文档流后要重新计算
          // this.update();
        } 
        tC(e, stuck, sticky);
        stl.position = pv;
        if (ns) return;
        stl.bottom = '';
        stl[vp] = `${p.stickyBitStickyOffset}px`;
        if (pv === 'fixed') {
          // debugger
          // if(!item.temp) {
          //   let temp = document.createElement('div');
          //   item.temp = temp;
          //   temp.style.height = `${it.el.offsetHeight}px`;
          //   // it.el.parentNode.insertBefore(temp,it.el);
          //   insertAfter(temp,it.el)
          // }
          stl[vp] = `${p.stickyBitStickyOffset + this.getTopPosition(p.scrollEl)}px`;
          // oxw: 脱离文档流后要重新计算
          // this.update();
        } 
        
      });
    } else if (isSticky) {
      it.state = 'default';
      rAF(() => {
        tC(e, sticky);
        tC(e, stuck);
        if (pv === 'fixed') {
          stl.position = '';
          if(item.temp) {
            item.temp.style.display = 'none';
          }
        } 
      });
    } else if (isStuck) {
      it.state = 'stuck';
      rAF(() => {
        tC(e, sticky, stuck);
        if (pv !== 'fixed' || ns) return;
        // oxw: 如果position是fixde，要加绝对定位，才能固定在父级元素的底部
        stl.top = '';
        stl.bottom = '0';
        stl.position = 'absolute';
      });
    }

    const isStickyChange = scroll >= change && scroll <= stop;
    const isNotStickyChange = scroll < change / 2 || scroll > stop;
    const stub = 'stub'; // a stub css class to remove
    if (isNotStickyChange) {
      rAF(() => { tC(e, stickyChange); });
    } else if (isStickyChange) {
      rAF(() => { tC(e, stub, stickyChange); });
    }
  }

  update(updatedProps = null) {
    for (let i = 0; i < this.instances.length; i += 1) {
      const instance = this.instances[i];
      this.computeScrollOffsets(instance);
      if (updatedProps) {
        for (const updatedProp in updatedProps) {
          instance.props[updatedProp] = updatedProps[updatedProp];
        }
      }
    }
    return this;
  }

  /*
    removes an instance 👋
    --------
    - cleanup instance
  */
  removeInstance(instance) {
    const e = instance.el;
    const p = instance.props;
    const tC = this.toggleClasses;
    e.style.position = '';
    e.style[p.verticalPosition] = '';
    tC(e, p.stickyClass);
    tC(e, p.stuckClass);
    tC(e.parentNode, p.parentClass);
  }

  /*
    cleanup 🛁
    --------
    - cleans up each instance
    - clears instance
  */
  cleanup() {
    for (let i = 0; i < this.instances.length; i += 1) {
      const instance = this.instances[i];
      if (instance.stateContainer) {
        instance.props.scrollEl.removeEventListener('scroll', instance.stateContainer);
      }
      this.removeInstance(instance);
    }
    this.manageState = false;
    this.instances = [];
  }
}

/*
  export
  --------
  exports StickBits to be used 🏁
*/
export default function stickybits(target, o) {
  return new Stickybits(target, o);
}
