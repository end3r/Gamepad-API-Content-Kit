Use your gamepad as a remote to control your slides
=====================================

This plugin for [reveal.js](https://github.com/hakimel/reveal.js) makes it possible to use a gamepad to advance through your slides.

Restrictions
=======
- needs an up to date browser with gamepad support (e.g. current chrome)


HowTo / Installation
=======
Just copy this repository into your reveal.js presentation to `/plugin/gamepad`.

Include this line in the  "dependencies" section in index.html:
`{ src: 'plugin/gamepad/gamepad.js'}´

Open your presentation and plug in your gamepad. You should now be able to trigger Reveal.js' navigateNext and navigatePrev methods with the following buttons:

Navigate to the next slide:
- right shoulder / RB /  R1
- left shoulder / LB / L1

Navigate to the previous slide:
- right shoulder bottom / RT / R2
- left shoulder bottom / LT / L2 

TODO
=======
- make use of the dpad to go next/prev and up/down
- make use of the other buttons (pause presentation and so on)
- use the analog stick to move a red point (like a laser pointer)
- ...