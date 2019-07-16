var vid;

$(document).ready(function(){
  if (typeof vid == 'undefined') {
    var qStr = getRequests();
    vid = new Video("http://10.0.0.137:3000/video/" + qStr['vid'], false);
    if (typeof vid == 'object') {
      $('#vid-player-con').append(vid);
      vid.id = 'video';
      plyr.setup("#video");
    }
  }
});

function Video(src, append) {
  var v = document.createElement("video");
  if (src != "") {
    v.src = src;
  }
  if (append == true) {
    document.body.appendChild(v);
  }
  return v;
}

function getRequests() {
var s1 = location.search.substring(1, location.search.length).split('&'),
    r = {},
    s2, i;
for (i = 0; i < s1.length; i += 1) {
    s2 = s1[i].split('=');
    r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
}
return r;
}
