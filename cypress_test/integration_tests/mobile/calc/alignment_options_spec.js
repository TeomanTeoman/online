/* global describe it cy beforeEach require afterEach*/

import 'cypress-wait-until';

var helper = require('../../common/helper');
var mobileHelper = require('../../common/mobile_helper');
var calcHelper = require('./calc_helper');

describe('Change alignment settings.', function() {
	beforeEach(function() {
		mobileHelper.beforeAllMobile('alignment_options.ods', 'calc');

		// Click on edit button
		mobileHelper.enableEditingMobile();
	});

	afterEach(function() {
		helper.afterAll('alignment_options.ods');
	});

	function getTextPosForFirstCell() {
		calcHelper.dblClickOnFirstCell();

		// Select text content
		cy.get('textarea.clipboard')
			.type('{ctrl}a', {force: true});

		cy.get('.leaflet-selection-marker-start')
			.invoke('position')
			.as('currentTextPos');

		calcHelper.removeTextSelection();
	}

	function openAlignmentPaneForFirstCell() {
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		cy.get('#ScAlignmentPropertyPanel')
			.click();

		cy.get('#AlignLeft')
			.should('be.visible');
	}

	it('Apply left/right alignment', function() {
		openAlignmentPaneForFirstCell();

		// Set right aligment first
		cy.get('#AlignRight')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'right');

		// Change alignment back
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		cy.get('#ScAlignmentPropertyPanel')
			.click();

		cy.get('#AlignLeft')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'left');
	});

	it('Align to center horizontally.', function() {
		openAlignmentPaneForFirstCell();

		cy.get('#AlignHorizontalCenter')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'center');
	});

	it('Change to block alignment.', function() {
		openAlignmentPaneForFirstCell();

		// Set right aligment first
		cy.get('#AlignBlock')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'justify');
	});

	it('Right-to-left and left-to-right writing mode.', function() {
		openAlignmentPaneForFirstCell();

		cy.get('#ParaRightToLeft')
			.click();

		// TODO: we don't have a way of testing this
		// copy container doesn't have info about this
		cy.wait(500);

		// Set right aligment first
		cy.get('#ParaLeftToRight')
			.click();

		cy.wait(500);
	});

	it('Align to the top and to bottom.', function() {
		openAlignmentPaneForFirstCell();

		cy.get('#AlignTop')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'top');

		// Change alignment back
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		cy.get('#ScAlignmentPropertyPanel')
			.click();

		cy.get('#AlignBottom')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'bottom');
	});

	it('Align to center vertically.', function() {
		openAlignmentPaneForFirstCell();

		cy.get('#AlignVCenter')
			.click();

		calcHelper.copyContentToClipboard();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'middle');
	});

	it('Increment / decrement text indent.', function() {
		// Get text position first
		getTextPosForFirstCell();
		cy.get('@currentTextPos')
			.as('originalTextPos');

		openAlignmentPaneForFirstCell();

		// Increase indent
		cy.get('#IncrementIndent')
			.click();

		// We use the text position as indicator
		cy.waitUntil(function() {
			getTextPosForFirstCell();

			return cy.get('@currentTextPos')
				.then(function(currentTextPos) {
					cy.get('@originalTextPos')
						.then(function(originalTextPos) {
							return originalTextPos.left < currentTextPos.left;
						});
				});
		});

		cy.get('@currentTextPos')
			.as('originalTextPos');

		// Decrease indent
		openAlignmentPaneForFirstCell();

		cy.get('#DecrementIndent')
			.click();

		// We use the text position as indicator
		cy.waitUntil(function() {
			getTextPosForFirstCell();

			return cy.get('@currentTextPos')
				.then(function(currentTextPos) {
					cy.get('@originalTextPos')
						.then(function(originalTextPos) {
							return originalTextPos.left > currentTextPos.left;
						});
				});
		});
	});
});