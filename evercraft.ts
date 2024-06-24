type Ability =
  | "Strength"
  | "Dexterity"
  | "Constitution"
  | "Wisdom"
  | "Intelligence"
  | "Charisma";

type AttackSkill = (naturalRoll: number) => Attack;

type Attack = { roll: number; damage: number; critical: boolean };

type Alignment = "Good" | "Neutral" | "Evil";

class Character {
  protected name: string;
  protected alignment: Alignment;
  protected armor: number;
  protected currentHP: number;
  protected maxHP: number;
  protected abilities: { [key in Ability]: number };
  protected level: number;
  protected currentExperience: number;
  protected experienceNeededToLevel: number; // This will allow XP Tables by Classes/Races
  protected modifiers: { [key in Ability]: (value: number) => number };

  constructor(
    name: string,
    alignment: Alignment,
    abilities: { [key in Ability]: number }
  ) {
    this.name = name;
    this.alignment = alignment;
    this.abilities = abilities;
    this.currentHP = this.maxHP;
    this.level = 1;
    this.currentExperience = 0;
    this.experienceNeededToLevel = 1000;
    this.modifiers = {
      Strength: (value) => Math.floor((value - 10) / 2),
      Dexterity: (value) => Math.floor((value - 10) / 2),
      Constitution: (value) => Math.floor((value - 10) / 2),
      Wisdom: (value) => Math.floor((value - 10) / 2),
      Intelligence: (value) => Math.floor((value - 10) / 2),
      Charisma: (value) => Math.floor((value - 10) / 2),
    };
    this.armor = 10 + this.modifiers.Dexterity(this.abilities.Dexterity);
    this.maxHP = Math.min(
      1,
      5 + this.modifiers.Constitution(this.abilities.Constitution)
    );
  }

  protected getName() {
    return this.name;
  }
  protected setName(name: string) {
    this.name = name;
  }

  protected getAlignment() {
    return this.alignment;
  }
  protected setAlignment(alignment: Alignment) {
    this.alignment = alignment;
  }

  protected dealsCritical(roll: number) {
    return roll === 20;
  }

  gainExperience(xp: number) {
    this.currentExperience += xp;
    while (this.currentExperience >= this.experienceNeededToLevel) {
      // In case a character levels up multiple times
      this.levelUp();
    }
  }

  levelUp() {
    this.currentExperience -= this.experienceNeededToLevel;
    this.level++;
    this.applyLevelUpBonus();
  }

  protected applyLevelUpBonus() {
    this.maxHP += 5 + this.modifiers.Constitution(this.abilities.Constitution);
  }

  engage(target: Character, attack = this.basicAttack) {
    const naturalRoll = rollDice(1, 20);
    if (target.takeHit(attack(naturalRoll))) {
      this.currentExperience += 10;
    }
  }

  protected basicAttack: AttackSkill = (naturalRoll: number): Attack => {
    // This does not actually "double Strength modifier on critical hits"
    // Because then Characters with negative strength modifiers would be punished for a critical hit.
    // Instead, it doubles the Strength value considered when applying the modifier, indirectly affecting applied modifiers.
    // This way, a negative modifier would be halved, while a positive one would be doubled.
    // This implementation is subject to interactions that change a Characters' ability values.
    const strength = this.dealsCritical(naturalRoll)
      ? this.abilities.Strength * 2
      : this.abilities.Strength;
    const damage = Math.min(1, 1 + this.modifiers.Strength(strength));
    const roll =
      naturalRoll + this.modifiers.Strength(strength) + (this.level % 2);
    const critical = naturalRoll === 20;
    return { roll, damage, critical };
  };

  protected takeHit(attack: Attack): number {
    if (attack.critical) {
      attack.damage *= 2;
    } else if (attack.roll < this.armor) {
      attack.damage = 0;
    }
    this.currentHP -= attack.damage;
    return attack.damage;
  }
}
