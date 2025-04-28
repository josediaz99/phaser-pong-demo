import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScreen" });
  }

  preload() {
    // Carregando assets necessários para a tela de título
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    );
  }

  create() {
    // Criando a bola animada no fundo
    this.ball = this.add.image(400, 250, "pixel").setScale(10);
    this.ball.setTint(0xffffff);

    // Título com efeito de brilho
    const title = this.add
      .text(400, 150, "PONG", {
        fontSize: "84px",
        fontFamily: "Arial Black",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        shadow: { color: "#000000", blur: 10, stroke: true, fill: true },
      })
      .setOrigin(0.5);

    // Menu de opções
    const menuItems = [
      { text: "START GAME", scene: "Game" },
      { text: "DIFFICULTY: NORMAL", callback: () => this.toggleDifficulty() },
    ];

    this.selectedItem = 0;
    this.menuTexts = [];

    menuItems.forEach((item, index) => {
      const y = 300 + index * 50;
      const text = this.add
        .text(400, y, item.text, {
          fontSize: "32px",
          fontFamily: "Arial",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      text.setInteractive({ useHandCursor: true });

      text.on("pointerover", () => {
        this.selectedItem = index;
        this.updateMenuSelection();
      });

      text.on("pointerdown", () => {
        if (item.scene) {
          this.scene.start(item.scene);
        } else if (item.callback) {
          item.callback();
        }
      });

      this.menuTexts.push(text);
    });

    // Instruções em inglês
    const instructions = this.add
      .text(
        400,
        450,
        "↑↓ Arrow keys to select   |   ENTER to confirm\n" +
          "Use ↑↓ arrow keys during the game to move the paddle",
        {
          fontSize: "16px",
          fontFamily: "Arial",
          color: "#888888",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Animação do título
    this.tweens.add({
      targets: title,
      scale: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    // Controles do teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.updateMenuSelection();
    this.setupBallAnimation();
  }

  setupBallAnimation() {
    // Animação da bola no fundo
    this.tweens.add({
      targets: this.ball,
      x: 800,
      y: 500,
      duration: 2000,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
  }

  toggleDifficulty() {
    const difficultyText = this.menuTexts[1];
    if (difficultyText.text.includes("NORMAL")) {
      difficultyText.setText("DIFFICULTY: HARD");
    } else if (difficultyText.text.includes("HARD")) {
      difficultyText.setText("DIFFICULTY: EASY");
    } else {
      difficultyText.setText("DIFFICULTY: NORMAL");
    }
  }

  updateMenuSelection() {
    this.menuTexts.forEach((text, index) => {
      text.setColor(index === this.selectedItem ? "#ffff00" : "#ffffff");
      text.setScale(index === this.selectedItem ? 1.2 : 1);
    });
  }

  update() {
    // Controle do menu com teclado
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
      this.updateMenuSelection();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.selectedItem = Math.min(
        this.menuTexts.length - 1,
        this.selectedItem + 1
      );
      this.updateMenuSelection();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      if (this.selectedItem === 0) {
        this.scene.start("Game");
      } else {
        this.toggleDifficulty();
      }
    }
  }
}
