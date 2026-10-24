const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13)){
 console.error('Helia needs Node.js 22.13+; Node.js 24 LTS is recommended. Install it from https://nodejs.org and reopen your terminal.');process.exit(1);
}
console.log(`Node.js ${process.versions.node}: ready`);
