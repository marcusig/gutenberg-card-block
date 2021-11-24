/**
 * BLOCK: sc-cards
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import './editor.scss';


//  Import CSS.
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { MediaUpload, InspectorControls } = wp.editor;
const { MediaPlaceholder, __experimentalLinkControl, BlockControls, RichText } = wp.blockEditor;
const { Popover, TextControl } = wp.components;
const { useCallback, useRef, useState } = wp.element;
import { link, linkOff } from '@wordpress/icons';
const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('cgb/block-sc-connected-issue', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Connected article'), // Block title.
	icon: 'admin-links', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [__('Connected'), __('issue'), __('cease')],
	attributes: {
		text: {
			type: 'string'
		},
		url: {
			type: 'string'
		},
		id: {
			type: 'integer'
		},
		linkTarget: {
			type: 'string'
		},
		rel: {
			type: 'string'
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function(props) {

		const { 
			isSelected,
			setAttributes,
		} = props;

		const {
			rel
		} = props.attributes;

		const onToggleOpenInNewTab = useCallback(
			( value ) => {
				const newLinkTarget = value ? '_blank' : undefined;
	
				let updatedRel = rel;
				if ( newLinkTarget && ! rel ) {
					updatedRel = NEW_TAB_REL;
				} else if ( ! newLinkTarget && rel === NEW_TAB_REL ) {
					updatedRel = undefined;
				}
	
				setAttributes( {
					linkTarget: newLinkTarget,
					rel: updatedRel,
				} );
			},
			[ rel, setAttributes ]
		);

		function onTextChange( newValue ) {
			props.setAttributes({
				text: newValue
			});
		}

		const opensInNewTab = props.attributes.linkTarget === '_blank';

		// Creates a <p class='wp-block-cgb-block-sc-cards'></p>.
		return [
			<div class="connected-issue">
				<h6>Connected issue</h6>
				<__experimentalLinkControl
					className="wp-block-navigation-link__inline-link-input"
					value={ { url: props.attributes.url, opensInNewTab: ( props.attributes.linkTarget === '_blank' ) } }
					onChange={ ( {
						url: newURL = '',
						opensInNewTab: newOpensInNewTab,
						id: newId = 0,
					} ) => {
						console.log('newId', newId);
						setAttributes( { url: newURL } );
						setAttributes( { id: newId } );
	
						if ( opensInNewTab !== newOpensInNewTab ) {
							onToggleOpenInNewTab( newOpensInNewTab );
						}
					} }
				/>
				{
					props.attributes.url
					&& ! props.attributes.id
					&& <TextControl
						placeholder={ __( 'Connected article name...' ) }
						value={ props.attributes.text }
						onChange={ onTextChange }
						identifier="text"
					/>
				}
			</div>
		];
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	// save: function( { attributes } ) {
	// 	return (
	// 		<div>
	// 			<a class="card-link" href={attributes.url} target={attributes.linkTarget} rel={attributes.rel}>
	// 				<img
	// 					class="card-link-image"
	// 					src={attributes.image}
	// 					alt={attributes.alt}
	// 				/>
	// 				<div
	// 					class="card-link-caption"
	// 				>
	// 					<span>
	// 						{attributes.text}
	// 					</span>
	// 				</div>
	// 			</a>
	// 		</div>
	// 	);
	// }
});
