// import { ChartTooltipModel } from "chart.js";
export function customTooltip (this:any,tooltipModel:any) {
  const self = (this as any);
  var tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.classList.add('hs-chartjs-tooltip-wrap');
    tooltipEl.innerHTML = '<div class="hs-chartjs-tooltip"></div>';
    document.body.appendChild(tooltipEl);
  }

  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0';
    tooltipEl?.parentNode?.removeChild(tooltipEl);
    return;
  }

  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem:any){
    return bodyItem.lines;
  }

  if(tooltipModel.body){
    var titleLines = tooltipModel.title || [];
    var bodyLines = tooltipModel.body.map(getBody);

    var date = new Date();
    var innerHtml = '<header class="hs-chartjs-tooltip-header">';

    titleLines.forEach(function(title:any){
      if(tooltipModel.beforeBody[0]){
        innerHtml += title + ", " + date.getFullYear()+" ("+tooltipModel.beforeBody[0]+")";
      }else{
        // innerHtml += title + ", " + date.getFullYear()
        title = title.split(' | ')
        innerHtml += `${title[0]}, ${date.getFullYear()} ${title[1] ? ` | ${title[1]}` : ''}`
          // + ", " + date.getFullYear() + " | " +  title[1] 

      }
    });
    innerHtml += '</header><div class="hs-chartjs-tooltip-body">';

    bodyLines.forEach(function(body:any,i:any){
      var colors = tooltipModel.labelColors[i];
      innerHtml += "<div>";
      innerHtml +=`<span class="d-inline-block rounded-circle mr-1" style="width:8px;height:8px;background-color:${colors['backgroundColor']}"></span>${body}`;
      innerHtml += "</div>";
    });
    innerHtml += "</div>";
    let chartTooltip = tooltipEl.querySelector(".hs-chartjs-tooltip");
    if(chartTooltip){
      chartTooltip.innerHTML = innerHtml;
    }
  }

  var l = (self as any)._chart.canvas.getBoundingClientRect();

  if(l){
    tooltipEl.style.opacity ='1';
    tooltipEl.style.left = l.left + window.pageXOffset + tooltipModel.caretX - tooltipEl.offsetWidth / 2 - 3 + "px";
    tooltipEl.style.top =l.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.offsetHeight - 25 + "px";
    tooltipEl.style.pointerEvents ='none';
    tooltipEl.style.transition = 'all 0.2s ease 0s';
  }
}
