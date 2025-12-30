import { select, insert, update, remove } from '../models/blogEntries.js';

const getAllBlogEntries = (req, res) => {
  const params = req.query; 
  select(params, (err, entries) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching blog entries ' });
    }
    res.json(entries);
  });
};

const getBlogEntryById = (req, res) => {
  const id = req.params.id;
  select({ id }, (err, entry) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching blog entry by id: '+ err.message });
    }
    if (!entry || entry.length === 0) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }
    res.json(entry[0]);
  });
};

const createBlogEntry = (req, res) => {
  const newEntry = req.body;
  insert(newEntry, (err, entry) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating blog entry' });
    }
    res.status(201).json(entry);
  });
};

const updateBlogEntry = (req, res) => {
  const id = req.params.id;
  const updatedEntry = req.body;
  update(id, updatedEntry, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating blog entry' });
    }
    res.status(200).json({ message: 'Blog entry updated' });
  });
};

const removeBlogEntry = (req, res) => {
  const id = req.params.id;
  remove(id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error removing blog entry' });
    }
    res.status(200).json({ message: 'Blog entry removed' });
  });
};

export default {
  getAllBlogEntries,
  getBlogEntryById,
  createBlogEntry,
  updateBlogEntry,
  removeBlogEntry,
};
