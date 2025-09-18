import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

const router = express.Router();
//listar
router.get("/situations",async(req:Request, res:Response) => {
    try{
    const situationRepository = AppDataSource.getRepository(Situation);

    const page = Number(req.query.page) || 1;

    const limit =1;

    const totalSituations = await situationRepository.count();

    if(totalSituations === 0){
         res.status(400).json({
            messagem : "Nenhuma situação encontrada!"
        });
        return
    }
    const lastPage = (totalSituations/limit)

    if(page > lastPage){
         res.status(400).json({
            messagem : `Pagina Invalida. O total de paginas é ${lastPage}`,
        });
        return
    }

    const offset = (page - 1) * limit;

    const situation = await situationRepository.find({
        take: limit,
        skip: offset,
        order: {id: "DESC"}
    })
    res.status(200).json({
        currentPage: page,
        lastPage,
        totalSituations,
        situation,
    })
    return



}catch(error){
     res.status(500).json({
            messagem : "Erro ao listar a situação!"
        });
        return
    }
});
//view id
router.get("/situations/:id",async(req:Request, res:Response) => {
    try{
        const{id} = req.params;

    const situationRepository = AppDataSource.getRepository(Situation);

    const situations = await situationRepository.findOneBy({id : parseInt(id)})

    if(!situations){
         res.status(404).json({
            messagem : "situação não encontrada!"
        });
        return
    }
    res.status(200).json(situations)
    return

}catch(error){
     res.status(500).json({
            messagem : "Erro ao listar a situação!"
        });
        return
    }
});
//create
router.post("/situations",async(req:Request, res:Response) => {

    try{
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);
        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem : "Situação cadastrada com sucesso!",
            situation : newSituation,
        });

    }catch(error){

        res.status(500).json({
            messagem : "Erro ao cadastrar a situação!"
        });


    }
});

//atualizar

router.put("/situations/:id",async(req:Request, res:Response) => {
    try{
        const{id} = req.params;

        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.findOneBy({id : parseInt(id)})

        if(!situations){
         res.status(404).json({
            messagem : "situação não encontrada!"
        });
        return
        }
        //atualizar os dados
        situationRepository.merge(situations, data);
        //salvar auterações
        const updateSituation = await situationRepository.save(situations)

        res.status(200).json({
            messagem : "Situação atualizada com sucesso!",
            situation : updateSituation,
        });

    }catch(error){
        res.status(500).json({
        messagem : "Erro ao atualizar a situação!"
        });
        return
    }
});

//deletar
router.delete("/situations/:id",async(req:Request, res:Response) => {
    try{
        const{id} = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.findOneBy({id : parseInt(id)})

        if(!situations){
         res.status(404).json({
            messagem : "situação não encontrada!"
        });
        return
        }
        //remove os dados no banco de dados
        await situationRepository.remove(situations);


        res.status(200).json({
            messagem : "Situação removida com sucesso!",
        });

    }catch(error){
        res.status(500).json({
        messagem : "Erro ao atualizar a situação!"
        });
        return
    }
});

export default router