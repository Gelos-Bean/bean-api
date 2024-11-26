import { Router } from 'express';
import Option from '../models/Option.js';

const router = Router(); 

router.post('/', (req, res) => {
    
    const add = req.body; 

    const newOption = new Option({
        name: add.name,
        price: add.price,
    });

    newOption.save()
        .then(() => {
            res.status(200).send({
                success: true,
                msg: `${newOption.name} saved`
            });
        })
        .catch(err => { 
            if (err.name === "ValidationError"){
                return res.status(400).send({ 
                    success: false, 
                    msg: err.message 
                });
            }
            res.status(500).send({ success: false, msg: err.message });
        });
});


router.get('/', async (req, res) => { 
    try {
        const allOptions = await Option.find({});

        if (!allOptions) {
            return res.status(400).send({ 
                success: false, 
                msg: 'No options found' 
            });
        }

        res.status(200).send({
            success: true, 
            msg: allOptions
        });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});


router.get('/:name', async (req, res) => {
    
    const optionNameURI = req.params.name.toLowerCase();
    
    try { 
        const findOption = await Option.find({
            name: { $regex: new RegExp(optionNameURI, "i") }
            });
            
        if(findOption.length === 0){
            return res.status(400).send({ 
                success: false, 
                msg: 'Option not found' 
            });
        }

        res.status(200).send({
            success: true,
            msg: findOption
        });

    } catch (err) { 

        res.status(500).send({ success: false, msg: err.message });
    };
});


router.put('/:id', async (req, res) => {

    try { 
        const updateOption = await Option.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).send({
            success: true,
            msg: `${updateOption.name} updated`
    });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Option not found' 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
});


router.delete('/:id', async (req, res) => { 

    try { 
        const deleteOption = await Option.findByIdAndDelete(req.params.id);

        res.status(200).send({ 
            success: true,
            msg: `${deleteOption.name} deleted successfully`
        });

    } catch (err) { 

        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Option not found' 
            });
        }

        res.status(500).send({ success: false, msg: err.message });
    };
});

export default router; 