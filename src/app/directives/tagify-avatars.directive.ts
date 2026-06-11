import { Directive, AfterViewInit, ElementRef } from '@angular/core';

declare const $:any;

@Directive({
  selector: '[tagifyAvatars]'
})
export class TagifyAvatarsDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(){
    // var settings = $(this.elementRef.nativeElement).attr('data-hs-tagify-options') ? JSON.parse($(this.elementRef.nativeElement).attr('data-hs-tagify-options')) : {},
    //   tagifyAvatars = $.HSCore.components.HSTagify.init($(this.elementRef.nativeElement), {
    //     templates: {
    //       tag: function tag(tagData:any):any {
    //         try {
    //           return "<tag title=\"" + tagData.value + "\" contenteditable=\"false\" spellcheck=\"false\" class=\"tagify__tag " + (tagData["class"] ? tagData["class"] : "") + "\" " + this.getAttributes(tagData) + ">" +
    //             "<x title=\"remove tag\" class=\"tagify__tag__removeBtn\"></x>" +
    //             "<div class=\"d-flex align-items-center\">" +
    //             "" + (tagData.src ? "<img class=\"avatar avatar-xss avatar-circle mr-2\" src=\"" + tagData.src.trim() + "\">" : "") + "" +
    //             "<span>" + tagData.value + "</span>" +
    //             "</div>" +
    //             "</tag>";
    //         } catch (err) { return null}
    //       },
    //       dropdownItem: function dropdownItem(tagData:any):any {
    //         try {
    //           return "<div " + this.getAttributes(tagData) + " class=\"tagify__dropdown__item " + (tagData["class"] ? tagData["class"] : "") + "\">" +
    //             "<img class=\"avatar avatar-xss avatar-circle mr-2\" src=\"" + tagData.src.trim() + "\">" +
    //             "<span>" + tagData.value + "</span>" +
    //             "</div>";
    //         } catch (err) {return null }
    //       }
    //     }
    //   }).addTags(settings.whitelist.slice(0, 1));
  }
}
