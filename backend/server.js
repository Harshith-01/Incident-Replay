import express from 'express';
import cors from 'cors';

const app=express();
const PORT=3000;

app.use(
    cors({
        origin:'http://localhost:4200'
    })
);

app.use(express.json());

const memory = [
  {
    id: '1',
    title: 'Task API Failure',
    description: 'POST /api/tasks returning 500',
    service: 'Task API',
    status: 'Investigating',
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Authentication Failure',
    description: 'Users unable to authenticate',
    service: 'Auth Service',
    status: 'Resolved',
    createdAt: '2026-09-29T10:00:00Z'
  }
];

app.use((request,response,next)=>{
    console.log(request.method,request.url);
    next();
});

app.get('/api/incidents',(request,response)=>{
    response.json(memory);
});

app.get('/api/incidents/:id',(request,response)=>{
    const id=request.params.id;
    const incident=memory.find((incident)=>incident.id===id);

    if(!incident){
        reponse.status(404).json({
            message:'Incident not found'
        });
        return;
    }
    response.json(incident);
});

app.post('/api/incidents', (request,response)=>{
    const incident={
        id:String(Date.now()),
        title:request.body.title,
        description:request.body.description,
        service:request.body.service,
        status:request.body.status??'Ivestigating',
        createdAt:new Date().toISOString()
    };
    memory.push(incident);
    response.status(201).json(incident);
});

app.put('/api/incidents/:id',(request,response)=>{
    const id=request.params.id;
    const incident=memory.find(
        (incident)=>incident.id===id
    );
    if(!incident){
        response.status(404).json({
            message:'Incident not found'
        });
        return;
    }

  incident.title = request.body.title;
  incident.description = request.body.description;
  incident.service = request.body.service;
  incident.status = request.body.status;

  response.json(incident);
});

app.delete('/api/incidents/:id',(request,response)=>{
    const id=request.params.id;
    const incidentIndex=memory.findIndex((incident)=>
    incident.id===id);

    if(incidentIndex===-1){
        response.status(404).json({
            message:'Incident not found'
        });
        return;
    }

    memory.splice(incidentIndex,1);

    response.status(204).send();
});


app.listen(PORT,()=>{
        console.log(`Server started at http://localhost:${PORT}`);
    });

