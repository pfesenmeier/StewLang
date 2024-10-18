prep {
  1m    cauliflower,      cut into 2" florets 
  1/2lb fresh @mozarella, torn
  1c    parm,             grated
  4l    eggs,             lightly beaten
  #     oven,             400F
}

dredge {
    1/2c AP @flour
    salt-and-pepper
    3c panko
  # 3 bowls
  - Place in @bowls and season
  - dip @prep.cauliflower pieces into @flour, @prep.eggs, then @panko
}

fry {
    1/2c olive-oil
  # large-skillet
  - fill @large-skillet with 1/2" @olive-oil, heat over medium-high heat
  - fry @dredge.cauliflower until golden brown, transfer to paper towel-lined plate
}

assemble {
    5c @tomato-sauce
  # 9x13" baking-pan
  - add thin layer of @tomate-sauce on bottom of @baking-pan
  - add third of @prep.parm
  @for i in 1..2 {
    - add half of @fry.cauliflower
    - add half @prep.mozarella
    - add half remaining @tomato-sauce
    - add half remaining @prep.parm
  }
}

bake {
  ! 40min baking
  - bake until cheese is golden and @assemble.sauce is bubbling, @baking
}

serve {
  fresh @basil leaves
  - cool 5m
  - top @bake with @basil
}
