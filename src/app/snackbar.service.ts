import { Injectable, Renderer2, ElementRef, RendererFactory2 } from '@angular/core';
import { TinyColor } from '@ctrl/tinycolor';

export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
}
export interface Snackbar {
  color?: String,
  message?: String,
  title: String,
  action?: Function,
  location?: 'BL' | 'BM' | 'BR' | 'MR' | 'TR' | 'TM' | 'TL' | 'ML',
  timeout?: Number /** Seconds */,
  close?: Boolean,
  desktop?: Boolean,
  desktopValues?: PushNotification,
  fontSize?: String,
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private currentSnack: Element;
  private permission: Permission;
  private rend: Renderer2;

  constructor(
    private rendFactory: RendererFactory2
  ) {
    this.rend = rendFactory.createRenderer(null, null);
  }

  public create(options) {
    if (options.desktop) {
      this.permission = this.isSupported() ? 'default' : 'denied';
      if (this.permission == 'default') {
        if (this.checkPermissions() == "granted") {
          this.createSnack(options);
          this.createDesktop(options);
        }
      }
    } else {
      this.createSnack(options);
    }
  }

  private createSnack(options) {
    if (this.currentSnack !== null && this.currentSnack !== undefined) {
      this.rend.setStyle(this.currentSnack, "opacity", "0");
      this.currentSnack = null;
      setTimeout(() => {
        this.currentSnack = null;
        this.createSnack(options);
      }, 500);
    } else {
      let snack: Element = this.getStyledSnack(options);
      let dismiss = () => {
        this.rend.setStyle(snack, "opacity", "0");
      }
      let title = this.rend.createText(options.title);
      this.rend.appendChild(snack, title);
      if (options.close) {
        let closeButton: Element = this.rend.createElement('div');
        this.rend.appendChild(snack, closeButton);
        closeButton.innerHTML = `<p style="margin: 0; padding: 0; text-align: right; cursor: pointer;">&times;</p>`;
        closeButton.addEventListener('click', dismiss);
      }
      if (options.message) {
        let container = options.message ? this.rend.createElement('div') : null;
        let message = this.rend.createText(options.message);
        let font = options.fontSize ? (parseInt(options.fontSize.replace("px")) - 2) + "px" : '14px';
        this.rend.setStyle(container, "fontSize", font);
        this.rend.appendChild(container, message);
        this.rend.appendChild(snack, container);
      }
      if (options.action) {
        let action = <any>options.action;
        snack.addEventListener('click', action);
        this.rend.setStyle(snack, "cursor", "pointer");
      }
      if (options.timeout) {
        setTimeout(() => {
          dismiss();
        }, options.timeout * 1000);
      } else if ((options.timeout == null || options.timeout == undefined) && (options.close == null || options.close == undefined)) {
        console.log("Got Here");
        setTimeout(() => {
          dismiss();
        }, 5000);
      }
      let self = this;
      snack.addEventListener('transitionend', function (e) {
        if (this.style.opacity == "0") {
          this.parentElement.removeChild(this);
          if (self.currentSnack === this) {
            self.currentSnack = null;
          }
        }
      });
      this.currentSnack = snack;
      this.rend.appendChild(document.body, snack);
      getComputedStyle(snack).bottom;
      getComputedStyle(snack).top;
      getComputedStyle(snack).right;
      getComputedStyle(snack).left;
      getComputedStyle(snack).opacity;
      if (window.innerWidth > 440) {
        if (options.location == "BL") {
          this.rend.setStyle(snack, "bottom", "20px");
          this.rend.setStyle(snack, "left", "20px");
        } else if (options.location == "BM") {
          this.rend.setStyle(snack, "bottom", "20px");
          this.rend.setStyle(snack, "left", "calc(50% - 200px)");
        } else if (options.location == "BR") {
          this.rend.setStyle(snack, "bottom", "20px");
          this.rend.setStyle(snack, "right", "20px");
        } else if (options.location == "MR") {
          this.rend.setStyle(snack, "bottom", "50%");
          this.rend.setStyle(snack, "right", "20px");
        } else if (options.location == "TR") {
          this.rend.setStyle(snack, "top", "20px");
          this.rend.setStyle(snack, "right", "20px");
        } else if (options.location == "TM") {
          this.rend.setStyle(snack, "top", "20px");
          this.rend.setStyle(snack, "left", "calc(50% - 200px)");
        } else if (options.location == "TL") {
          this.rend.setStyle(snack, "top", "20px");
          this.rend.setStyle(snack, "left", "20px");
        } else if (options.location == "ML") {
          this.rend.setStyle(snack, "bottom", "50%");
          this.rend.setStyle(snack, "left", "20px");
        } else {
          this.rend.setStyle(snack, "bottom", "20px");
          this.rend.setStyle(snack, "left", "20px");
        }
      } else {
        console.log("getting here");
        this.rend.setStyle(snack, "maxWidth", "calc(100% - 20px)");
        this.rend.setStyle(snack, "minWidth", "calc(100% - 20px)");
        this.rend.setStyle(snack, "bottom", "0px");
        this.rend.setStyle(snack, "left", "0px");
        this.rend.setStyle(snack, "right", "0px");
      }
      this.rend.setStyle(snack, "opacity", "1");
    }
  }

  private getStyledSnack(options): Element {
    let snack: Element = this.rend.createElement("div");
    let color = "#cccccc";
    let background: any = "#222222";
    if (options.color) {
      background = new TinyColor(options.color);
      if (background.isDark()) {
        color = background.lighten(70).toString();
      } else {
        color = background.darken(70).toString();
      }
    }
    let fontSize = options.fontSize ? options.fontSize : "16px";
    let hasClose = options.close ? options.close : false;
    let gridColumns = hasClose ? '3fr 1fr' : '1fr';

    this.rend.setStyle(snack, "transitionProperty", "opacity, bottom, left, right, top, width, margin, border-radius");
    this.rend.setStyle(snack, "transitionDuration", "0.5s");
    this.rend.setStyle(snack, "transitionTimingFunction", "ease-out");
    this.rend.setStyle(snack, "fontSize", fontSize);
    this.rend.setStyle(snack, "minHeight", "13px");
    this.rend.setStyle(snack, "background", background.toString());
    this.rend.setStyle(snack, "position", "fixed");
    this.rend.setStyle(snack, "display", "grid");
    this.rend.setStyle(snack, "gridTemplateColumns", gridColumns);
    this.rend.setStyle(snack, "color", color);
    this.rend.setStyle(snack, "padding", "15px 10px");
    this.rend.setStyle(snack, "textAlign", "left");
    this.rend.setStyle(snack, "gridRowGap", "10px");
    this.rend.setStyle(snack, "fontWeight", "900");

    if (window.innerWidth > 440) {
      this.rend.setStyle(snack, "maxWidth", "400px");
      this.rend.setStyle(snack, "minWidth", "400px");
      if (options.location == "BL") {
        this.rend.setStyle(snack, "bottom", "0px");
        this.rend.setStyle(snack, "left", "20px");
      } else if (options.location == "BM") {
        this.rend.setStyle(snack, "bottom", "0px");
        this.rend.setStyle(snack, "left", "calc(50% - 200px)");
      } else if (options.location == "BR") {
        this.rend.setStyle(snack, "bottom", "0px");
        this.rend.setStyle(snack, "right", "20px");
      } else if (options.location == "MR") {
        this.rend.setStyle(snack, "bottom", "50%");
        this.rend.setStyle(snack, "right", "0px");
      } else if (options.location == "TR") {
        this.rend.setStyle(snack, "top", "20px");
        this.rend.setStyle(snack, "right", "0px");
      } else if (options.location == "TM") {
        this.rend.setStyle(snack, "top", "0px");
        this.rend.setStyle(snack, "left", "calc(50% - 200px)");
      } else if (options.location == "TL") {
        this.rend.setStyle(snack, "top", "20px");
        this.rend.setStyle(snack, "left", "0px");
      } else if (options.location == "ML") {
        this.rend.setStyle(snack, "bottom", "50%");
        this.rend.setStyle(snack, "left", "0px");
      } else {
        this.rend.setStyle(snack, "bottom", "0px");
        this.rend.setStyle(snack, "left", "20px");
      }
    } else {
      this.rend.setStyle(snack, "maxWidth", "calc(100% - 20px)");
      this.rend.setStyle(snack, "minWidth", "calc(100% - 20px)");
      this.rend.setStyle(snack, "bottom", "0px");
      this.rend.setStyle(snack, "left", "0px");
      this.rend.setStyle(snack, "right", "0px");
    }

    this.rend.setStyle(snack, "opacity", "0");
    return snack;
  }

  private createDesktop(options) {

  }

  private isSupported(): boolean {
    return 'Notification' in window;
  }

  private checkPermissions(): Permission {
    if ('Notification' in window) {
      Notification.requestPermission((status: Permission) => {
        this.permission = status;
        return this.permission;
      });
    } else {
      return this.permission;
    }
  }
}

/**
 * 
 * 
 * 
  .paper-snackbar {
    transition-property: opacity, bottom, left, right, width, margin, border-radius;
    transition-duration: 0.5s;
    transition-timing-function: ease;
    font-size: 14px;
    min-height: 14px;
    background-color: #323232;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    line-height: 22px;
    padding: 18px 24px;
    bottom: 0px;
    opacity: 0;
  
  }
  
  @media (min-width: 640px) {
    .paper-snackbar {
      min-width: 288px;
      max-width: 568px;
      display: inline-flex;
      border-radius: 2px;
      margin: 24px;
      bottom: -100px;
      
    }
  }
  
  @media (max-width: 640px) {
    .paper-snackbar {
      left: 0px;
      right: 0px;
    }
  }
  
  .paper-snackbar .action {
    background: inherit;
    display: inline-block;
    border: none;
    font-size: inherit;
    text-transform: uppercase;
    color: #ffeb3b;
    margin: 0px 0px 0px 24px;
    padding: 0px;
    min-width: min-content;
    box-shadow: none;
    outline: none;
  }
 */
