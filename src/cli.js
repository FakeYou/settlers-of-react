import clc from 'cli-color';

import Board from './catan/Board';
import Tile from './catan/Tile';
import Edge from './catan/Edge';
import Corner from './catan/Corner';

const board = Board.generateBeginnerBoard();

function hexToCoord(q, r) {
	return [
		Math.floor(q * 6) + 80,
		Math.floor(r * 4 - (q % 2) * 2) - 5,
	];
}

function resourceColors(resource) {
	switch (resource) {
		case Tile.Resource.FOREST:
			return clc.whiteBright.bgGreen;
		case Tile.Resource.PASTURE:
			return clc.black.bgGreenBright;
		case Tile.Resource.FIELD:
			return clc.black.bgYellowBright;
		case Tile.Resource.HILL:
			return clc.black.bgRed;
		case Tile.Resource.MOUNTAIN:
			return clc.black.bgBlackBright;
		case Tile.Resource.DESERT:
			return clc.bgWhite;
		case Tile.Resource.WATER:
			return clc.bgCyan;
		default:
			return clc.black.bgMagentaBright;
	}
}

function drawResource(x, y, resource) {
	const color = resourceColors(resource);

	process.stdout.write(clc.move.to(x + 3, y + 1) + color('   '));
	process.stdout.write(clc.move.to(x + 2, y + 2) + color('     '));
	process.stdout.write(clc.move.to(x + 3, y + 3) + color('   '));
}

function drawNumber(x, y, number, resource) {
	if (!number) {
		return;
	}

	const color = resourceColors(resource);
	let string;

	if (number === 10 || number === 11 || number === 12) {
		string = `${number} `;
	}
	else {
		string = ` ${number} `;
	}

	process.stdout.write(clc.move.to(x + 3, y + 2) + color(string));
}

function drawEdge(x, y, position, player) {
	const color = player ? player.color : clc.whiteBright;

	switch (position) {
		case Edge.Position.NORTH:
			process.stdout.write(clc.move.to(x + 3, y) + color('---'));
			break;
		case Edge.Position.WEST:
			process.stdout.write(clc.move.to(x + 1, y + 1) + color('/'));
			break;
		case Edge.Position.EAST:
			process.stdout.write(clc.move.to(x + 7, y + 1) + color('\\'));
			break;
		default:
			return;
	}
}

function drawCorner(x, y, position, player) {
	const char = 'o';
	const color = clc.whiteBright;

	switch (position) {
		case Corner.Position.LEFT:
			process.stdout.write(clc.move.to(x, y + 2) + color(char));
			break;
		case Corner.Position.RIGHT:
			process.stdout.write(clc.move.to(x + 8, y + 2) + color(char));
			break;
		default:
			return;
	}
}

Object.values(board.tiles).forEach(tile => {
	const [x, y] = hexToCoord(...tile.offset);
	drawResource(x, y, tile.resource);

	drawNumber(x, y, tile.number, tile.resource);
});

Object.values(board.edges).forEach(edge => {
	const [x, y] = hexToCoord(...edge.offset);
	drawEdge(x, y, edge.position);
});

Object.values(board.corners).forEach(corner => {
	const [x, y] = hexToCoord(...corner.offset);
	drawCorner(x, y, corner.position);
});

process.stdout.write(clc.move.lines(10));