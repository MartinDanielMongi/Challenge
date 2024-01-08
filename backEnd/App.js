const spawn = require("child_process").spawn;
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.post('/image', async(req, res) => {
    console.log(req.body);

    // Cargar path de DB
  const parameters = [
    parseInt(req.body.imageId),
    parseInt(req.body.position.x*44.4),
    parseInt(req.body.position.y*44.4),
    parseInt(req.body.size.width*44.4),
    parseInt(req.body.size.height*44.4),
    Boolean(req.body.grayscale)
  ];
    console.log(req.body.image)
    path_to_image="";
    if (parameters[0]==1){
        path_to_image="C:\\Python\\Challenge2\\src\\modules\\scriptcrop\\GC39OT_R06_V01_CODEX_JP_S0M.jpeg"
    }
    if (parameters[0]==2){
        path_to_image="C:\\Python\\Challenge2\\src\\modules\\scriptcrop\\GC39OT_R07_V01_CODEX_JP_S0M.jpeg"
    }
    if (parameters[0]==3){
        path_to_image="C:\\Python\\Challenge2\\src\\modules\\scriptcrop\\GC39OT_R12_V01_CODEX_JP_S0M.jpeg"
    }
    const pythonProcess = spawn('python',["C:\\Python\\Challenge2\\src\\modules\\scriptcrop\\crop.py", path_to_image, parameters[1],  parameters[2], parameters[3], parameters[4], parameters[5]]);
    
    let data = "";
    for await (const buffer of pythonProcess.stdout) {
        data +=buffer.toString();
            }

    console.log(data);   
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
    });
  
    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

  res.send({
    result: data
  });
});

// Listen
var server = app.listen(8000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
 
    console.log("Example app listening at http://%s:%s", host, port);
 });
