app.post("/api/auth/login", async (req,res)=>{
  const { militaryId, fullName } = req.body;
  if(!militaryId || !fullName) return res.status(400).json({message:"Invalid input"});

  let user = await db.getUserByMilitaryId(militaryId);
  if(!user) {
    user = await db.createUser({ fullName, militaryId, role: militaryId==="ADMIN123"?"admin":"officer" });
    if(user.role==="officer") {
      // خۆکار request زیاد دەکات
      await db.createRequest(user.id,{title:"Sample Request",content:"Auto-created request.",attachments:[]});
    }
  }

  req.session.userId = user.id;
  res.json(user);
});