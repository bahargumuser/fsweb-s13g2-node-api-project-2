// posts için gerekli routerları buraya yazın
const { addListener } = require("../server");
const postModel = require("./posts-model");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    let allPosts = await postModel.find();
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    let posts = await postModel.findById(req.params.id);
    //link üzerindeki id'leri .params sayesinde aldık
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});
router.post("/", async (req, res) => {
  try {
    let { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    } else {
      let { id } = await postModel.insert({
        title: title,
        contents: contents,
      });
      let insertedPost = await postModel.findById(id);
      res.status(201).json(insertedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      if (!title || !contents)
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      else {
        await postModel.update(req.params.id, {
          title: title,
          contents: contents,
        });
        let updatedPost = await postModel.findById(req.params.id);
        res.json(updatedPost);
      }
    }

    let { title, contents } = req.body;
    if (!title || !contents)
      res
        .status(400)
        .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    else {
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      await postModel.remove(req.params.id);
      res.json({ message: "Silme işlemi başarılı" });
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});
router.get("/:id/comments", async (req, res) => {
  try {
    let isPostExist = await postModel.findById(req.params.id);
    if (!isPostExist) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await postModel.findPostComments(req.params.id);
      res.json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
