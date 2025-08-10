document.addEventListener('DOMContentLoaded', () => {
    const square = document.getElementById('square');
    const ball = document.getElementById('ball');

    const squareSize = 300;
    const ballSize = 20;
    const radius = ballSize / 2;

    // Ball's properties in the square's coordinate system
    let pos = { x: squareSize / 2, y: radius }; // Start at the bottom center
    let vel = { x: 0, y: 0 };

    const gravity = 0.2;
    const bounceFactor = 0.8; // Elasticity

    let lastTime = 0;
    function gameLoop(timestamp) {
        if (!lastTime) {
            lastTime = timestamp;
        }
        const deltaTime = (timestamp - lastTime) / 16.67; // Normalize to 60 FPS
        lastTime = timestamp;

        // 1. Get the rotation of the square
        const computedStyle = window.getComputedStyle(square);
        const transform = computedStyle.transform;
        let angle = 0;
        if (transform !== 'none') {
            const values = transform.split('(')[1].split(')')[0].split(',');
            const a = values[0];
            const b = values[1];
            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        const radAngle = angle * (Math.PI / 180);

        // 2. Transform gravity to the square's local coordinate system
        const gravityX = Math.sin(radAngle) * gravity;
        const gravityY = Math.cos(radAngle) * gravity;

        // 3. Apply gravity to velocity
        vel.x += gravityX * deltaTime;
        vel.y += gravityY * deltaTime;

        // 4. Update position with velocity
        pos.x += vel.x * deltaTime;
        pos.y += vel.y * deltaTime;

        // 5. Collision detection and response
        // Bottom wall
        if (pos.y <= radius) {
            pos.y = radius;
            vel.y *= -bounceFactor;
            // Apply friction
            vel.x *= 0.98;
        }
        // Top wall
        if (pos.y >= squareSize - radius) {
            pos.y = squareSize - radius;
            vel.y *= -bounceFactor;
        }
        // Left wall
        if (pos.x <= radius) {
            pos.x = radius;
            vel.x *= -bounceFactor;
        }
        // Right wall
        if (pos.x >= squareSize - radius) {
            pos.x = squareSize - radius;
            vel.x *= -bounceFactor;
        }

        // 6. Update ball's visual position
        // The CSS 'top' and 'left' are relative to the top-left corner.
        // Our position `y` is from the bottom, so we convert it.
        ball.style.left = `${pos.x - radius}px`;
        ball.style.top = `${squareSize - pos.y - radius}px`;


        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});
