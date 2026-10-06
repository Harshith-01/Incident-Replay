import express from "express";

const app=express();
const PORT=3000;

app.use(express.json());

const memory=[
    {
        "id": "1",
        "title": "Task API Failure"
    },
    {
        "id": "2",
        "title": "Authentication Failure"
    }
];

app.use((request, response, next) => {
    console.log(
        request.method,
        request.url
    );

    next();
});

app.get("/api/incidents",(request,response)=>{
    response.json(memory)
});



app.get("/api/incidents/:id",(request,response)=>{
    const id=request.params.id;
    const incident=memory.find(incident=>incident.id===id);

    if(!incident){
        response.status(404).json({
            message:"Icident not found"
        });
        return;
    }
        response.json(incident);
});

app.post("/api/incidents",(request,response)=>{

    const incident={
        id:String(memory.length+1),
        title:request.body.title,
        description:request.body.description,
        service:request.body.service
    }
    memory.push(incident);
    response.status(201).json(incident);

});

app.put("/api/incidents/:id",(request,response)=>{
    const id=request.params.id;
    const incident=memory.find((incident)=>incident.id===id);
    if(!incident){
        response.status(404).json({
            message:"Incident not found"
        });
        return;
    }
    incident.title=request.body.title;
    incident.description=request.body.description;
    incident.service=request.body.service;
    response.json(incident);
})

app.delete("/api/incident/:id",(request,response)=>{
    const id=request.params.id;
    const incidetnIndex=memory.findIndex((incident)=>incident.id===id);
    if(incidetnIndex===-1){
        response.status(404).json({
            message:"Incident not found"
        });
        return;
    }
    incident.splice(incidetnIndex,1);
    response.status(204).send();
});


app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});