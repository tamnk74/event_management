import Post from '../../../models/post';
import * as postService from '../services/post';
import { getPostSerializer, getSimplePostSerializer } from '../serializer';
import Pagination from '../../../helpers/Pagination';

const postSerializer = getPostSerializer();
const simplePostSerializer = getSimplePostSerializer();

export default class PostController {
  /**
   * Paginate post
   */
  index = async (req, res, next) => {
    try {
      const pagination = new Pagination(req.query);
      const result = await postService.paginate({
        ...req.query,
        skip: pagination.skip,
        limit: pagination.limit,
      });

      pagination
        .setOriginalUrl(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
        .setTotal(result.total);
      const meta = pagination.getMeta();
      const links = pagination.getLinks();

      return res.status(200).json(getPostSerializer(links, meta).serialize(result.items));
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Get one post
   */
  show = async (req, res, next) => {
    try {
      const { post } = req;

      return res.status(200).json(postSerializer.serialize(post));
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Add new post
   */
  create = async (req, res, next) => {
    try {
      const post = new Post({
        slug: req.body.title,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category_id,
        user: req.user.id,
      });

      const newPost = await post.save();
      console.log(newPost);
      return res.status(201).json(simplePostSerializer.serialize(newPost));
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Update an post
   */
  update = async (req, res, next) => {
    try {
      const { post } = req;

      await Post.findByIdAndUpdate(req.params.id, {
        name: req.body.name || post.name,
        startDate: req.body.startDate || post.startDate,
        dueDate: req.body.dueDate || post.dueDate,
        description: req.body.description || post.description,
      });

      return res.status(204).json({});
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Delete an post
   */
  delete = async (req, res, next) => {
    try {
      await Post.findByIdAndRemove(req.params.id);

      return res.status(204).json({});
    } catch (err) {
      return next(err);
    }
  };
}
