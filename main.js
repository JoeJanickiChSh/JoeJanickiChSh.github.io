/**
 *
 * TEAM|MATCH|LEFT AUTO|DOCKED AND ENGAGED|DOCKED AND NOT ENGAGED|NUMLINKS|NAME|
 *
 */



const load = id => document.getElementById(id);
const loadval = id => document.getElementById(id).value;
const loadbool = id => document.getElementById(id).checked * 1;


setInterval(() => {

  format = `${loadval('team-number')}|`
  format += `${loadval('match')}|`
  format += `${loadbool('left-auto')}|`
  format += `${loadbool('docked-engaged')}|`
  format += `${loadbool('docked')}|`
  format += `${loadval('links')}|`
  format += `${loadval('name')}|`



  qrcode.clear(); // clear the code.
  qrcode.makeCode(format); // make another code.
}, 1000);