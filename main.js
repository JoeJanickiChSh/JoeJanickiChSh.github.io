/**
 *
 * TEAM|LEFT AUTO|DOCKED AND ENGAGED|DOCKED AND NOT ENGAGED|NUMLINKS
 *
 */



const load = id => document.getElementById(id);
const loadval = id => document.getElementById(id).value;
const loadbool = id => document.getElementById(id).checked * 1;


setInterval(() => {

  format = `${loadval('team-number')}|${loadbool('left-auto')}|${loadbool('docked-engaged')}|${loadbool('docked')}|${loadval('links')}`

  qrcode.clear(); // clear the code.
  qrcode.makeCode(format); // make another code.
}, 1000);