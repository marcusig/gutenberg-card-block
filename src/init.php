<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function sc_cards_cgb_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'sc_cards-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'sc_cards_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function sc_cards_cgb_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'sc_cards-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'sc_cards-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'sc_cards_cgb_editor_assets' );

function sc_init_add_blocks() {
	register_block_type(
		'cease/team-members',
		array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'           => 'mlc12_rock_and_roll-cgb-style-css',
			// // Enqueue blocks.build.js in the editor only.
			// 'editor_script'   => 'mlc12_rock_and_roll-cgb-block-js',
			// // Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'    => 'mlc12_rock_and_roll-cgb-block-editor-css',
			// Server-side render for the front end.
			'render_callback' => 'cease_team_members'
		)
	);
	
	add_image_size( 'cease-team', 500, 500, true );
}

add_action( 'init', 'sc_init_add_blocks' );

function cease_team_members( $attributes, $content ) {
	// To do: add control to specify number of posts to display.
	$recent_posts = get_posts(array(
		'post_type'   => 'team-member',
		'numberposts' => -1,
		'post_status' => 'publish',
		'orderby'     => 'menu_order',
		'order'       => 'ASC'
	));
	
	if (count($recent_posts) === 0) {
		return 'No team members';
	}

	ob_start();

	echo '<div class="wp-block-columns alignfull cease-team">';

	foreach ($recent_posts as $post) : 
		$img = get_the_post_thumbnail( $post, 'cease-team' );
		?>
		<div class="wp-block-column team-member">
			<div class="team-member--photo">
				<?php if( $img ) echo $img; ?>
			</div>
			<div class="team-member--text">
				<h4><?php echo $post->post_title; ?></h4>
				<p class="position">
					<?php echo get_post_meta( $post->ID, 'position', true ); ?>
				</p>
				<a href="#" class="read-more">Show bio</a>
			</div>
			<div class="more" style="display: none;">
				<?php echo apply_filters( 'the_content', $post->post_content ); ?>
			</div>
		</div>

	<?php endforeach;
	
	
	echo '</div>';
	return ob_get_clean();
}

function cease_custom_image_sizes( $sizes ) {
	return array_merge( $sizes, array(
		'large' => 'Large',
	) );
}
// add_filter( 'image_size_names_choose', 'cease_custom_image_sizes' );
