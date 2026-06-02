const express = require("express");
const Scooter = require("../models/Scooter");
const ScooterImage = require("../models/ScooterImage");

const router = express.Router();

const mockScooters = [
  {
    name: "Yamaha NVX",
    version: "155 VVA",
    description: "Dòng xe tay ga thể thao được cộng đồng DTH Scooter Team yêu thích nhờ thiết kế mạnh mẽ, động cơ 155 VVA và khả năng tùy biến cao.",
    thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39"
  },
  {
    name: "Yamaha NVX",
    version: "155 VVA Monster Energy",
    description: "Phiên bản tem Monster Energy nổi bật, phù hợp phong cách touring, street style và các bản độ cá tính trong cộng đồng NVX.",
    thumbnail: "https://images.unsplash.com/photo-1609630875171-b1321377ee65"
  },
  {
    name: "Yamaha NVX",
    version: "155 VVA Custom",
    description: "Bản custom tập trung vào dàn áo, mâm, phuộc, pô và các phụ kiện nâng cấp thẩm mỹ cho anh em chơi xe.",
    thumbnail: "https://images.unsplash.com/photo-1558980664-10e7170b5df9"
  }
];

const mockImageSets = [
  [
    {
      title: "NVX góc trước",
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39"
    },
    {
      title: "NVX chạy phố",
      imageUrl: "https://images.unsplash.com/photo-1558981001-792f6c0d5068"
    }
  ],
  [
    {
      title: "Monster Energy side view",
      imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65"
    },
    {
      title: "Monster Energy detail",
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"
    }
  ],
  [
    {
      title: "Custom garage",
      imageUrl: "https://images.unsplash.com/photo-1558980664-10e7170b5df9"
    },
    {
      title: "Custom night ride",
      imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8"
    }
  ]
];

const seedMockDataIfNeeded = async () => {
  const scooterCount = await Scooter.countDocuments();

  if (scooterCount > 0) {
    return;
  }

  const createdScooters = await Scooter.insertMany(mockScooters);

  const imageDocuments = createdScooters.flatMap((scooter, index) => {
    return mockImageSets[index].map((image) => {
      return {
        scooterId: scooter._id,
        title: image.title,
        imageUrl: image.imageUrl
      };
    });
  });

  await ScooterImage.insertMany(imageDocuments);
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

    const scooters = await Scooter.find().sort({ createdAt: 1 });

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

router.get("/scooters/:id", async (req, res) => {
  try {
    await seedMockDataIfNeeded();

    const scooter = await Scooter.findById(req.params.id).populate("images");

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

module.exports = router;
