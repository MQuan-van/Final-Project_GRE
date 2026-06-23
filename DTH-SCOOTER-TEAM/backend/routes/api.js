const express = require("express");
const mongoose = require("mongoose");
const Scooter = require("../models/Scooter");
const ScooterImage = require("../models/ScooterImage");
const Milestone = require("../models/Milestone");
const TeamStory = require("../models/TeamStory");

const router = express.Router();

const mockScooters = [
  {
    name: "DTH Scooter Team",
    version: "NVX 155 VVA V1",
    description: "Dòng xe tay ga thể thao được cộng đồng DTH Scooter Team yêu thích nhờ thiết kế mạnh mẽ, động cơ 155 VVA và khả năng tùy biến cao.",
    thumbnail: "/images/v1.png",
    slug: "v1",
    order: 1
  },
  {
    name: "DTH Scooter Team",
    version: "NVX 155 VVA V2",
    description: "Phiên bản tem Monster Energy nổi bật, phù hợp phong cách touring, street style và các bản độ cá tính trong cộng đồng NVX.",
    thumbnail: "/images/v2.png",
    slug: "v2",
    order: 2
  },
  {
    name: "DTH Scooter Team",
    version: "NVX 155 VVA V3",
    description: "Bản custom tập trung vào dàn áo, mâm, phuộc, pô và các phụ kiện nâng cấp thẩm mỹ cho anh em chơi xe.",
    thumbnail: "/images/v3.png",
    slug: "v3",
    order: 3
  }
];

const mockImageSets = [
  [
    { title: "NVX góc trước", imageUrl: "/images/v1.png" },
    { title: "NVX chạy phố", imageUrl: "/images/v1-story.jpg" }
  ],
  [
    { title: "Monster Energy side view", imageUrl: "/images/v2.png" },
    { title: "Monster Energy detail", imageUrl: "/images/v2_2.png" }
  ],
  [
    { title: "Custom garage", imageUrl: "/images/v3.png" },
    { title: "Custom night ride", imageUrl: "/images/v3-story.jpg" }
  ]
];

const mockMilestones = [
  {
    label: "V1", year: "2023", title: "Khởi đầu — NVX 155 VVA V1",
    description: "[Placeholder] Câu chuyện về bản V1 — điểm xuất phát, ý tưởng ban đầu, những thử nghiệm đầu tiên.",
    image: "/images/v1-story.jpg", order: 1
  },
  {
    label: "V2", year: "2024", title: "Tiến hoá — NVX 155 VVA V2",
    description: "[Placeholder] Câu chuyện về bản V2 — những gì đã thay đổi, bài học rút ra từ V1, hướng đi mới.",
    image: "/images/v2-story.jpg", order: 2
  },
  {
    label: "V3", year: "2025", title: "Hoàn thiện — NVX 155 VVA V3",
    description: "[Placeholder] Câu chuyện về bản V3 — dấu ấn riêng, độ hoàn thiện, và những gì còn ở phía trước.",
    image: "/images/v3-story.jpg", order: 3
  }
];

const mockTeamStory = {
  founderName: "Nguyễn Tiến Hải",
  founderImage: "/images/founder.jpg",
  founderBirthday: "28 May 1982",
  story: {
    title: "Our Story",
    content: "[Placeholder] Câu chuyện về người sáng lập DTH Scooter Team — vì sao bắt đầu, điều gì thúc đẩy, và tầm nhìn cho cộng đồng."
  }
};

const seedMockDataIfNeeded = async () => {
  const scooterCount = await Scooter.countDocuments();
  if (scooterCount === 0) {
    const createdScooters = await Scooter.insertMany(mockScooters);
    const imageDocuments = createdScooters.flatMap((scooter, index) => {
      return mockImageSets[index].map((image) => ({
        scooterId: scooter._id,
        title: image.title,
        imageUrl: image.imageUrl
      }));
    });
    await ScooterImage.insertMany(imageDocuments);
  }

  const milestoneCount = await Milestone.countDocuments();
  if (milestoneCount === 0) {
    await Milestone.insertMany(mockMilestones);
  }

  const teamStoryCount = await TeamStory.countDocuments();
  if (teamStoryCount === 0) {
    await TeamStory.create(mockTeamStory);
  }
};

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DTH Scooter Team API is running"
  });
});

router.get("/scooters", async (req, res) => {
  try {
    await seedMockDataIfNeeded();

    const scooters = await Scooter.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: scooters.length,
      data: scooters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách xe",
      error: error.message
    });
  }
});

router.get("/scooters/:slug", async (req, res) => {
  try {
    await seedMockDataIfNeeded();

    const scooter = await Scooter.findOne({ slug: req.params.slug }).populate("images");

    if (!scooter) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dòng xe"
      });
    }

    return res.status(200).json({
      success: true,
      data: scooter
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết xe",
      error: error.message
    });
  }
});

router.get("/milestones", async (req, res) => {
  try {
    await seedMockDataIfNeeded();

    const milestones = await Milestone.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách milestone",
      error: error.message
    });
  }
});

router.get("/team-story", async (req, res) => {
  try {
    await seedMockDataIfNeeded();

    const teamStory = await TeamStory.findOne();

    if (!teamStory) {
      return res.status(404).json({
        success: false,
        message: "Chưa có dữ liệu team story"
      });
    }

    res.status(200).json({
      success: true,
      data: teamStory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy team story",
      error: error.message
    });
  }
});

module.exports = router;