import { getAll, getById, getByImportance, create, update, remove } from '../models/sponsor.js';

const getAllSponsors = async (req, res) => {
    try {
        const sponsors = await getAll();
        res.json(sponsors);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching sponsors' });
    }
};

const getSponsorById = async (req, res) => {
    const id = req.params.id;
    try {
        const sponsor = await getById(id);
        if (!sponsor) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }
        res.json(sponsor);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching sponsor by id' });
    }
};

const getSponsorByImportance = async (req, res) => {
    const importance = req.params.importance;
    try {
        const sponsor = await getByImportance(importance);
        if (!sponsor) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }
        res.json(sponsor);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching sponsor by importance' });
    }
};

const createSponsor = async (req, res) => {
    const newSponsor = req.body;
    try {
        const sponsor = await create(newSponsor);
        res.status(201).json(sponsor);
    } catch (err) {
        return res.status(500).json({ message: 'Error creating sponsor' });
    }
};

const updateSponsor = async (req, res) => {
    const id = req.params.id;
    const sponsorUpdated = req.body;
    try {
        await update(id, sponsorUpdated);
        res.status(200).json({ message: 'Sponsor updated' });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating sponsor' });
    }
};

const removeSponsor = async (req, res) => {
    const id = req.params.id;
    try {
        await remove(id);
        res.status(200).json({ message: 'Sponsor removed' });
    } catch (err) {
        return res.status(500).json({ message: 'Error removing sponsor' });
    }
};

export default {
    getAllSponsors,
    getSponsorById,
    getSponsorByImportance,
    createSponsor,
    updateSponsor,
    removeSponsor,
};
