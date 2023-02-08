import PostModel from '../models/post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "getting posts failed"
        })
    }
}

export const getPost = async (req, res) => {
    try {

        const postId = req.params.id


        await PostModel.findOneAndUpdate({
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(404).json({
                        message: "problem with returning post"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "no such post"
                    })
                }
                res.json(doc)

            }
        )

    } catch (err) {

    }
}
export const remove = async (req, res) => {
    try {

        const postId = req.params.id

        await PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                return res.status(500).json({
                    message: "error with removing post"
                })
            }
            if (!doc) {
                return res.status(500).json({
                    message: "post not found"
                })
            }

            res.json("Post is deleted")
        })

    } catch (err) {

    }
}
export const update = async (req, res) => {
    try {

        const postId = req.params.id

        await PostModel.updateOne({
                _id: postId
            }, {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl
            }
        )
        res.json("Post updated")


    } catch (err) {
        res.status(500).json({
            message: "post error"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save();

        res.json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Post error"
        })
    }
}
