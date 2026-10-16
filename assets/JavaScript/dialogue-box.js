// Arquivo: rpg.js

let activeDialogueInstance = null; 

class DialogueManager {
    constructor(config) {
        this.script = config.script;
        this.dialogueIndex = 0;
        this.currentText = '';
        this.charIndex = 0;
        this.isTyping = false;
        this.canAdvance = true;
        this.timeoutId = null;

        this.boxElement = document.getElementById(`dialogue-box-${config.id}`);
        this.textElement = document.getElementById(`dialogue-text-${config.id}`);
        this.imgElement = document.getElementById(`speaker-img-${config.id}`);
        
        if (this.boxElement) {
            this.boxElement.addEventListener('click', this.handleInteraction.bind(this));
            
            this.boxElement.addEventListener('mousedown', this.setActive.bind(this));
            
        } else {
            return;
        }

        this.startDialogue();
    }
    
    setActive() {
        activeDialogueInstance = this;
    }

    handleInteraction() {
        
        this.setActive();
        this.advanceDialogue();
    }

    typeWriter() {
        if (this.charIndex < this.currentText.length) {
            this.textElement.textContent += this.currentText.charAt(this.charIndex);
            this.charIndex++;
            this.timeoutId = setTimeout(this.typeWriter.bind(this), 50); 
        } else {
            this.isTyping = false;
            this.canAdvance = true;
        }
    }

    startDialogue() {
        if (this.dialogueIndex >= this.script.length) {
            this.dialogueIndex = 0; 
        }

        const dialogue = this.script[this.dialogueIndex];
        
        this.currentText = dialogue.text;
        this.charIndex = 0;
        this.isTyping = true;
        this.canAdvance = false;
        
        this.textElement.textContent = '';
        this.imgElement.src = dialogue.image;

        this.typeWriter();
    }

    advanceDialogue() {
        if (this.isTyping) {
            clearTimeout(this.timeoutId);
            this.textElement.textContent = this.currentText; 
            this.isTyping = false;
            this.canAdvance = true;
            
        } else if (this.canAdvance) {
            this.dialogueIndex++;
            this.startDialogue();
        }
    }
}

const dialogueInstances = [];

document.addEventListener('DOMContentLoaded', () => {
    if (typeof dialogueConfigs !== 'undefined') {
        dialogueConfigs.forEach(config => {
            const manager = new DialogueManager(config);
            dialogueInstances.push(manager);
            
            
            if (activeDialogueInstance === null) {
                activeDialogueInstance = manager;
            }
        });
    }

    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'z' || event.key === 'Z') {
            if (activeDialogueInstance) {
                activeDialogueInstance.advanceDialogue(); 
            }
        }
    });
});