/**
 * BLOCK: sc-cards
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { MediaUpload } = wp.editor;
const { MediaPlaceholder, __experimentalLinkControl, BlockControls, RichText, InspectorControls } = wp.blockEditor;
const { Popover, ToolbarButton, PanelBody } = wp.components;
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
registerBlockType('cease/know-the-facts', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Know the fact'), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [__('Know the facts'), __('cease'), __('create-guten-block')],
	attributes: {
		image: {
			type: 'string',
			default: null // no image by default
		},
		text: {
			type: 'string'
		},
		url: {
			type: 'string'
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
				console.log();
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

		function URLPicker( {
			isSelected,
			url,
			setAttributes,
			opensInNewTab,
			onToggleOpenInNewTab,
			anchorRef,
		} ) {
			const [ isURLPickerOpen, setIsURLPickerOpen ] = useState( false );
			const urlIsSet = !! url;
			const urlIsSetandSelected = urlIsSet && isSelected;
			const openLinkControl = () => {
				setIsURLPickerOpen( true );
				return false; // prevents default behaviour for event
			};
			const unlinkButton = () => {
				setAttributes( {
					url: undefined,
					linkTarget: undefined,
					rel: undefined,
				} );
				setIsURLPickerOpen( false );
			};
			const linkControl = ( isURLPickerOpen || urlIsSetandSelected ) && (
				<Popover
					position="bottom center"
					onClose={ () => setIsURLPickerOpen( false ) }
					anchorRef={ anchorRef ? anchorRef.current : '' }
				>
					<__experimentalLinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={ { url, opensInNewTab } }
						onChange={ ( {
							url: newURL = '',
							opensInNewTab: newOpensInNewTab,
						} ) => {
							setAttributes( { url: newURL } );
		
							if ( opensInNewTab !== newOpensInNewTab ) {
								onToggleOpenInNewTab( newOpensInNewTab );
							}
						} }
					/>
				</Popover>
			);
			return (
				[
					<BlockControls group="block">
						{ ! urlIsSet && (
							<ToolbarButton
								name="link"
								icon={ link }
								title={ __( 'Link' ) }
								// shortcut={ displayShortcut.primary( 'k' ) }
								onClick={ openLinkControl }
							/>
						) }
						{ urlIsSetandSelected && (
							<ToolbarButton
								name="link"
								icon={ linkOff }
								title={ __( 'Unlink' ) }
								// shortcut={ displayShortcut.primaryShift( 'k' ) }
								onClick={ unlinkButton }
								isActive={ true }
							/>
						) }
					</BlockControls>,
					linkControl
				]
			);
		}

		function onImageSelect(image) {
			
			var url = image.sizes ? ( image.sizes.large ? image.sizes.large.url : image.sizes.full.url ) : ( image.url ? image.url : '' );
			console.log( 'changing image', props.attributes.url, url );
			props.setAttributes({
				image: url
			});
		}

		function onTextChange( newText ) {
			props.setAttributes({
				text: newText
			});
		}
		

		// Creates a <p class='wp-block-cgb-block-sc-cards'></p>.
		return [
			<InspectorControls>
				<PanelBody>
					<legend>Select image: </legend>
					<MediaUpload
						onSelect={onImageSelect}
						type="image"
						value={props.attributes.image}
						render={({ open }) => <button class="button" onClick={open}>{props.attributes.image ? 'Change image' : 'Upload / choose image'}</button>}
					/>
				</PanelBody>
			</InspectorControls>,
			<figure class="wp-block-image size-large fact">
				{
					[
						props.attributes.image && <img
							class="card-link-image"
							src={props.attributes.image}
							alt={props.attributes.alt}
						/>,
						! props.attributes.image && <MediaPlaceholder
							labels={ {
								title: __( 'Image' ),
								instructions: __(
									'Upload an image or video file, or pick one from your media library.'
								),
							} }
							onSelect={ onImageSelect }
							accept="image/*"
							//notices={ noticeUI }
							//disableMediaButtons={ hasBackground }
							// onError={ ( message ) => {
							// 	removeAllNotices();
							// 	createErrorNotice( message );
							// } }
						/>,
						<figcaption>
							<RichText
								aria-label={ __( 'Fact text' ) }
								placeholder={ __( 'Add text...' ) }
								value={ props.attributes.text }
								onChange={ onTextChange }
								withoutInteractiveFormatting
								identifier="text"
							/>
						</figcaption>
					]
				}
			</figure>,
			<URLPicker
				url={ props.attributes.url }
				setAttributes={ setAttributes }
				isSelected={ isSelected }
				opensInNewTab={ props.attributes.linkTarget === '_blank' }
				onToggleOpenInNewTab={ onToggleOpenInNewTab }
				anchorRef={ useRef() }
			/>
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
	save: function( { attributes } ) {
		return (
			<figure class="wp-block-image size-large fact">
				<a class="card-link" href={attributes.url} target={attributes.linkTarget} rel={attributes.rel}>
					<img
						class="card-link-image"
						src={attributes.image}
						alt={attributes.alt}
					/>
					
					<figcaption>{attributes.text}</figcaption>
				</a>
			</figure>
		);
	}
});
