const elib = require("effectlib");
const plib = require("plib");

const shotgunRound = extend(BasicBulletType, {});
shotgunRound.damage = 8;
shotgunRound.bulletWidth = 5;
shotgunRound.bulletHeight = 12;
shotgunRound.bulletShrink = 0.3;
shotgunRound.drag = 0.01;
shotgunRound.speed = 6;
shotgunRound.lifetime = 17;
shotgunRound.hitEffect = Fx.hitBulletSmall;
shotgunRound.shootEffect = Fx.shootBig;
shotgunRound.smokeEffect = Fx.shootBigSmoke;

const shotgun = extendContent(Weapon, "shotgun", {
  load(){
    this.region = Core.atlas.find(modName + "-shotgun-equip");
  }
});
shotgun.width = 5;
shotgun.length = 5.5;
shotgun.recoil = 3;
shotgun.reload = 30;
shotgun.shots = 20;
shotgun.spacing = 0;
shotgun.inaccuracy = 12;
shotgun.alternate = true;
shotgun.ejectEffect = Fx.shellEjectBig;
shotgun.shake = 2;
shotgun.velocityRnd = 0.5;
shotgun.shootSound = Sounds.shootBig;
shotgun.bullet = shotgunRound;

const upsylonPlasma = extend(BasicBulletType, {});
upsylonPlasma.splashDamage = Vars.state.rules.playerDamageMultiplier * 27;
upsylonPlasma.splashDamageRadius = 20;
upsylonPlasma.speed = 12;
upsylonPlasma.lifetime = 60;
upsylonPlasma.drag = 0.05;
upsylonPlasma.shootEffect = Fx.shootBig;
upsylonPlasma.smokeEffect = Fx.shootBigSmoke;
upsylonPlasma.trailEffect = newEffect(30, e => {
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 1, Mathf.lerp(6, 0.2, e.fin()));
});
upsylonPlasma.hitEffect = newEffect(20, e => {
  elib.outlineCircle(e.x, e.y, Pal.lancerLaser, e.fout() * 6, 1 + e.fin() * (upsylonPlasma.splashDamageRadius + 4));
  elib.fillCircle(e.x, e.y, Pal.lancerLaser, 0.2 + e.fout() * 0.8, Mathf.lerp(upsylonPlasma.splashDamageRadius, 0.2, e.fin()));
});
upsylonPlasma.despawnEffect = upsylonPlasma.hitEffect;

const upsylon = extendContent(Mech, "upsylon-mech", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },
  updateAlt(player){
    if(player.shootHeat > 0.01){
      Time.run(this.secondaryReload / 2, run(() => {
        this._shots++;
        var i = Mathf.signs[this._shots % 2];
        this.pl1.trns(player.rotation - 90, i * this.weaponOffsetX, this.weaponOffsetY);
        var dir = player.rotation + i * this.secondaryAngle;
        Calls.createBullet(upsylonPlasma, player.getTeam(),
          player.x + this.pl1.x, player.y + this.pl1.y,
          dir, 1, 1
        );
      }));
    }
  }
});
upsylon.pl1 = new Vec2();
upsylon._shots = 0;
upsylon.secondaryAngle = 45;
upsylon.secondaryReload = 60;
upsylon.speed = 0.5;
upsylon.boostSpeed = 1.2;
upsylon.drag = 0.1;
upsylon.mass = 3.5;
upsylon.drillPower = 6;
upsylon.mineSpeed = 1.2;
upsylon.itemCapacity = 70;
upsylon.shake = 2;
upsylon.engineColor = plib.frontColorCyan;
upsylon.engineOffset = 5.6;
upsylon.health = 250;
upsylon.buildPower = 1.8;
upsylon.weaponOffsetX = 2;
upsylon.weapon = shotgun;
