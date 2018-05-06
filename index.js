const fs = require('fs');

let header;
let files = [];

// case1
// var targetDuration = 2;
// var INPUT_PATH = "D:/xampp/htdocs/2/dash/test2_main_index/Video1";
// var OUTPUT_FILE = "D:/xampp/htdocs/2/dash/test2_main_index/Video1/cmaf.m3u8";
// case2
var targetDuration = 4;
var INPUT_PATH = "D:/xampp/htdocs/1/dash_to_hls/111";
var OUTPUT_FILE = "D:/xampp/htdocs/1/dash_to_hls/cmaf.m3u8";

/*
 string 字符串;
 str 指定字符;
 split(),用于把一个字符串分割成字符串数组;
 split(str)[0],读取数组中索引为0的值（第一个值）,所有数组索引默认从0开始;
 */
function getStr(string, str) {
  var str_before = string.split(str)[0];
  var str_after = string.split(str)[1];

  return str_before;
}

function sortSegments(a, b) {
  var ret;

  var index1 = getStr(a, '.');
  var index2 = getStr(b, '.');

  // console.log('index1.length: ' + index1.length);
  // console.log('index2.length: ' + index2.length);
  if (index1.length > index2.length) {
    ret = 1;
  } else if (index1.length < index2.length) {
    ret = -1;
  } else {
    ret = index1.localeCompare(index2);
  }

  //console.log(a + ' - ' + b + ' = ' + ret);
  return ret;
}

function ScanDir(path) {
  try {
    console.log('+ScanDir');

    fs.readdirSync(path).forEach(function(file) {
      if (file.indexOf('mp4') !== -1) {
        header = file;
      } else {
        files.push(file);
      }
    });
  } catch (e) {
    console.log('e: ', e);
  }
}

function main() {
  ScanDir(INPUT_PATH);
  files.sort(sortSegments);
  console.log('header: ' + header);

  var manifest = '#EXTM3U' + '\r\n' +
    '#EXT-X-TARGETDURATION:' + targetDuration + '\r\n' +
    '#EXT-X-VERSION:7' + '\r\n' +
    '#EXT-X-PLAYLIST-TYPE:VOD' + '\r\n' +
    '#EXT-X-INDEPENDENT-SEGMENTS' + '\r\n' +
    '#EXT-X-MAP:URI=' + header + '\r\n';

  files.forEach(function(file) {
    manifest += ('#EXTINF:' + targetDuration + '\r\n');
    manifest += (file + '\r\n');
  });

  manifest += ('#EXT-X-ENDLIST' + '\r\n');

  //console.log('manifest: ' +  manifest);
  fs.writeFileSync(OUTPUT_FILE, manifest);
}

// var a = sortSegments('segment_9.m4s', 'segment_18.m4s');
// console.log('a: ' + a);

// var b = sortSegments('segment_1.m4s', 'segment_12.m4s');
// console.log('b: ' + b);

main();





