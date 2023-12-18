import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved, waitFor, act } from '@testing-library/react';
import LevelEditorComp from '..';
import userEvent from '@testing-library/user-event';
import { LevelEditor } from '../../../main/LevelEditor';

// Setup canvas and brush
let ctx: CanvasRenderingContext2D;

const setupCanvas = () => {
    const canvas = document.createElement('canvas');
    const brush = document.createElement('div');
    brush.id = "Canvas-brush";
    brush.title = "drawing brush";
    canvas.id = "Canvas";
    canvas.title = "canvas for drawing";
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    document.body.appendChild(brush);
    ctx = canvas.getContext('2d')!;
    if (!ctx) throw new Error('Could not get 2d context');
}

const setup = async () => {
    const lvl = new LevelEditor(ctx, {});
    await lvl.init();
    render(<LevelEditorComp editor={lvl}/>);
}

beforeAll(() => {
    setupCanvas();
})

beforeEach(() => {
    setup();
    jest.useFakeTimers();
})

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
})

describe ('LevelEditor user interactions', () => {

    test('Open/Close panel', async () => {
        // Verify panel closed initially
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        // Verify panel opens on click on title name
        userEvent.click(screen.getByRole('heading'));
        expect(await screen.findByRole('combobox')).toBeInTheDocument();
        // Verify panel closes on click on title name
        userEvent.click(screen.getByRole('heading' , {name: 'LEVEL EDITOR'}));
        await waitForElementToBeRemoved(() => screen.queryByRole('combobox'));
    });

    test('Turn on/off clipping mode', async () => {
        // Open panel and select any option
        userEvent.click(screen.getByRole('heading'));
        userEvent.selectOptions(await screen.findByRole('combobox'), 'grassland');
        // Turn on clipping
        const button = screen.getByRole('button', {name: 'toggle clipping mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle clipping mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn clipping mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off clipping
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn clipping mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Turn on/off drag mode', async () => {
        // Open panel and select any option
        userEvent.click(screen.getByRole('heading'));
        userEvent.selectOptions(await screen.findByRole('combobox'), 'grassland');
        // Turn on drag
        const button = screen.getByRole('button', {name: 'toggle drag mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle drag mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn drag mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off drag
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn drag mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Turn on/off trash mode', async () => {
        // Open panel and select any option
        userEvent.click(screen.getByRole('heading'));
        userEvent.selectOptions(await screen.findByRole('combobox'), 'grassland');
        // Turn on trash
        const button = screen.getByRole('button', {name: 'toggle trash mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle trash mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn trash mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off trash
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn trash mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Show trash delete all button and trigger confirmation dialog', async () => {
        // Open panel and select any option
        userEvent.click(screen.getByRole('heading'));
        userEvent.selectOptions(await screen.findByRole('combobox'), 'grassland');
        // Turn on trash
        userEvent.click(screen.getByRole('button', {name: 'toggle trash mode'}));
        // Click delete all
        userEvent.click(await screen.findByRole('button', {name: 'delete all'}));
        // Verify confirmation dialog and confirm button
        const confirmButton = await screen.findByRole('button', {name: 'delete all confirm'});
        const dialog = await screen.findByText("Are you sure? Action can't be UNDONE!");
        expect(dialog).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
        // Advance time and verify dialog automatically closes
        act(() => jest.advanceTimersByTime(3000));
        expect(confirmButton).not.toBeInTheDocument();

    });

    test('Turn on/off edit mode', async () => {
        // Open panel and select any option
        userEvent.click(screen.getByRole('heading'));
        userEvent.selectOptions(await screen.findByRole('combobox'), 'grassland');
        // Turn on edit
        const button = screen.getByRole('button', {name: 'toggle editing mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle editing mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn edit mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off edit
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn edit mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Show tooltip on brush tile', async () => {
        // Open panel
        userEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        userEvent.selectOptions(await screen.findByRole('combobox'), 'dungeon');
        // Set example tile
        const tileExampleOne = screen.getByRole('checkbox', {name: 'tile 1-1'});
        // Select new tile
        userEvent.click(tileExampleOne);
        // Verify tooltip shows
        expect(screen.getAllByRole('tooltip')).not.toBeNull(); 
        
        // Comments:
        // could show multiple tooltips but easy to test since every tile is repeated with the same style and the first solution is `display:none` not enabled
    });

    test('Select brush tile', async () => {
        // Open panel
        userEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        userEvent.selectOptions(await screen.findByRole('combobox'), 'dungeon');
        // Set example tiles
        const tileExampleOne = screen.getByRole('checkbox', {name: 'tile 1-1'});
        const tileExampleTwo = screen.getByRole('checkbox', {name: 'tile 1-2'});
        // Select new tile
        userEvent.click(tileExampleOne);
        // Verify visual style is added
        expect(tileExampleOne.style.opacity).toBe("1");
        expect(tileExampleOne.ariaChecked).toBe("true");
        // Select another new tile
        userEvent.click(tileExampleTwo);
        // Verify visual style is removed from previous tile
        expect(tileExampleOne.style.opacity).toBe("");
        expect(tileExampleOne.ariaChecked).toBe("false");
        // Verify visual style is added to new tile
        expect(tileExampleTwo.style.opacity).toBe("1");
        expect(tileExampleTwo.ariaChecked).toBe("true");
    });

    test('Mouse brush shadow effect', async () => {
        // Open panel
        userEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        userEvent.selectOptions(await screen.findByRole('combobox'), 'dungeon');
        // Set example tile
        const tileExampleOne = screen.getByRole('checkbox', {name: 'tile 1-1'});
        // Select new tile
        userEvent.click(tileExampleOne);
        // Verify brush is not shown yet
        expect(screen.getByTitle("drawing brush")).not.toHaveStyle("display: flex; left: 0px; top: 0px; width: 16px; height: 32px;");
        // Hover on canvas
        userEvent.hover(screen.getByTitle("canvas for drawing"));
        // Verify brush is shown
        expect(await screen.findByTitle("drawing brush")).toHaveStyle("display: flex; left: 0px; top: 0px; width: 16px; height: 32px;");
        
    })

})
