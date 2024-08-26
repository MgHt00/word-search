# Functions
    start()
      |- findAndFill()


### findAndFill()
direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်

    findAndFill()
      |- enoughSq() 
      |- existingCharCheck()
      |- fillAWord()
      |- listAWord()

### fillAWord() 
ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
    
    fillAWord() 
      |- enoughSq()
      |- charFill()

### enoughSq()
ရလာတဲ့ direction မှာ sq လောက်သလားစစ်မယ်

    enoughSq()
      |- checkRight()
      |- checkLeft()
      |- checkTop()
      |- checkBelow()

### charFill() 
sq တစ်ကွက်ချင်းကို char တစ်လုံးချင်း ဖြည့်မယ် ၊ staring sq နဲ့ ending sq နာမည်တွေကို startAndEnd[] ထဲ သိမ်းမယ်။

### existingCharCheck()
လက်ရှိအကွက်မှာ char ရှိနေရင် သုံးလို့ ရ ၊ မရ စစ်မယ်

    existingCharCheck()
      |- oneByOneCheck()
  
### oneByOneCheck()
sq အကွက်မှာဖြည့်မယ့် char နဲ့ object ထဲထည့်ထားပြီးတဲ့ char တူလား တစ်လုံးချင်းစစ်မယ်
  
### listAWord() 
HTML မှာ word တွေ list လုပ်ဖို့ 
  
### processChar()
saveIT သတ်မှတ်မယ်။ charFill() ကို ပြန်ခေါ်မယ်

    processChar()
      |- charFill()
  
### checkRight(), checkLeft(), checkTop(), checkBelow()
row, col တွက်ပြီး isWithinBounds() ကို call

    checkRight(), checkLeft(), checkTop(), checkBelow()
      |- isWithinBounds()

### attemptPlacement()
sq လုံလောက်လား ၊ char ရှိနေလား ၊ ရှိတဲ့ char က သုံးလို့ရလားစစ်

    attemptPlacement()
      |- enoughSq()
      |- existingCharCheck()
      |- fillAWord()
  
### isWithinBounds()
row, col လောက် မလောက်စစ် 

### getRandomDirection()
direction ကို random ထုတ်

### chooseNewPosition()
startingRow, startingCol အသစ် ပြန်ထုတ်