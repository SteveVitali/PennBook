package edu.upenn.nets212.pennbook;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

/**
 * The main driver class for this MapReduce implementation of friend
 * recommendation via adsorption. This contains helper methods for deleting
 * directories and handling output from the "diff" command, code for parsing and
 * running the various commands, a composite command for running the entire job,
 * and global state such as the CONVERGENCE variable. Adapted from work in HW3.
 * 
 * @author nets212, Tim Clancy
 * @version 12.10.15
 */
public class RecommendDriver {
	// Note: convergence isn't defined as a command-line argument so it is
	// hardcoded here.
	public static final double CONVERGENCE = 0.1;
	public static final int MAX_ITERATIONS = 25;

	/**
	 * The main method for executing Recommend commands.
	 * 
	 * @param args
	 *            the arguments to parse into commands.
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		// Print name.
		System.out.println("By Tim Clancy (clancyt).");

		// Find which command is entered.
		if (args.length == 4) {
			String command = args[0];

			// If it's the init command
			if (command.equals("init")) {
				init(args);
			} else // If it's the iter command
			if (command.equals("iter")) {
				iter(args);
			} else // If it's the finish command
			if (command.equals("finish")) {
				finish(args);
			} else if (command.equals("pre")) {
				pre(args);
			} else {
				System.out.println(args[0]
						+ " is not a valid command (check your arguments).");
			}
		} else if (args.length == 5) {
			if (args[0].equals("diff")) {
				diff(args);
			} else {
				System.out.println(args[0]
						+ " is not a valid command (check your arguments).");
			}
		} else if (args.length == 7) {
			if (args[0].equals("composite")) {
				// Given the command string:
				// composite <inputDir> <outputDir> <intermDir1> <intermDir2>
				// <diffDir> <#reducers>
				// Prepare arguments for our commands. There are two sets of
				// "iter" arguments because these must swap input back and
				// forth between two directories.
				String[] preArgs = {"pre", args[1], "preInitOut", args[6]};
				String[] initArgs = { "init", "preInitOut", args[3], args[6] };
				String[] iterOneArgs = { "iter", args[3], args[4], args[6] };
				String[] iterTwoArgs = { "iter", args[4], args[3], args[6] };
				String[] diffArgs = { "diff", args[3], args[4], args[5],
						args[6] };

				// Begin the adsorption algorithm.
				// First, pre-initialize then initialize:
				pre(preArgs);
				init(initArgs);

				// Define variables for handling the alternating "iter"
				// commands.
				int iterCount = 0;
				boolean iterOne = true;

				// Next, iterate unto convergence.
				// Or, until a maximum number of iterations has been reached.
				// This is in the case that input doesn't converge.
				boolean converged = false;
				int runs = 0;
				while (!converged && runs < MAX_ITERATIONS) {
					// Perform iter on the appropriate directory.
					if (iterOne) {
						iter(iterOneArgs);
						iterOne = false;
						iterCount++;
					} else {
						iter(iterTwoArgs);
						iterOne = true;
						iterCount++;
					}

					// Per homework write-up: Note, running the diff task after
					// every iteration could
					// add considerable time to your job, so you may want to run
					// the diff task after every two or three iterations
					// to save computation time.
					// Therefore diff runs following every third iter.
					if (iterCount % 3 == 0) {
						diff(diffArgs);

						// Check if convergence has been reached
						if (readDiffResult(args[5]) <= CONVERGENCE) {
							converged = true;
						}
					}

					runs++;
				}

				// Now that we've converged, finish.
				// When finishing, we need to remember the
				// most-recently-accessed "iter" directory.
				if (iterOne) {
					String[] finishArgs = { "finish", args[3], args[2], args[6] };
					finish(finishArgs);
				} else {
					String[] finishArgs = { "finish", args[4], args[2], args[6] };
					finish(finishArgs);
				}
			} else {
				System.out.println(args[0]
						+ " is not a valid command (check your arguments).");
			}
		} else // Various error handling.
		if (args.length == 0) {
			System.out.println("Please enter a command.");
		} else {
			if (args[0].equals("pre")) {
				System.out
						.println("pre syntax: pre <inputDir> <outputDir> <#reducers>");
			}
			if (args[0].equals("init")) {
				System.out
						.println("init syntax: init <inputDir> <outputDir> <#reducers>");
			}
			if (args[0].equals("iter")) {
				System.out
						.println("iter syntax: iter <inputDir> <outputDir> <#reducers>");
			}
			if (args[0].equals("diff")) {
				System.out
						.println("diff syntax: diff <inputDir1> <inputDir2> <outputDir> <#reducers>");
			}
			if (args[0].equals("finish")) {
				System.out
						.println("finish syntax: finish <inputDir> <outputDir> <#reducers>");
			}
			if (args[0].equals("composite")) {
				System.out
						.println("composite syntax: composite <inputDir> <outputDir> <intermDir1> <intermDir2> <diffDir> <#reducers>");
			}
		}
	}

	/**
	 * Execute the "pre" command on the provided arguments.
	 * 
	 * @param args
	 *            the arguments to run "pre" with.
	 * @throws Exception
	 */
	private static void pre(String[] args) throws Exception {
		// Grab our input and output paths
		String input = args[1];
		String output = args[2];

		Configuration conf = new Configuration();
		Job job = new Job(conf, "pre");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperPreInit.class);
		job.setReducerClass(RecommendReducerPreInit.class);

		// Set the input directory.
		FileInputFormat.addInputPath(job, new Path(input));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(output);
		FileOutputFormat.setOutputPath(job, new Path(output));

		// Set the number of reducers from our command args
		job.setNumReduceTasks(Integer.parseInt(args[3]));

		// Wait for the job to finish
		job.waitForCompletion(true);
	}

	/**
	 * Execute the "init" command on the provided arguments.
	 * 
	 * @param args
	 *            the arguments to run "init" with.
	 * @throws Exception
	 */
	private static void init(String[] args) throws Exception {
		// Grab our input and output paths
		String input = args[1];
		String output = args[2];

		// Most of this boilerplate setup was followed from the updated
		// version of the Hadoop tutorial provided with the assignment
		// write-up.
		// I found the link on Piazza:
		// http://wiki.apache.org/hadoop/WordCount
		Configuration conf = new Configuration();
		Job job = new Job(conf, "init");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperInit.class);
		job.setReducerClass(RecommendReducerInit.class);

		// Set the input directory.
		FileInputFormat.addInputPath(job, new Path(input));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(output);
		FileOutputFormat.setOutputPath(job, new Path(output));

		// Set the number of reducers from our command args
		job.setNumReduceTasks(Integer.parseInt(args[3]));

		// Wait for the job to finish
		job.waitForCompletion(true);
	}

	/**
	 * Execute the "iter" command on the provided arguments.
	 * 
	 * @param args
	 *            the arguments to run "iter" with.
	 * @throws Exception
	 */
	private static void iter(String[] args) throws Exception {
		// Grab our input and output paths
		String input = args[1];
		String output = args[2];

		// Most of this boilerplate setup was followed from the updated
		// version of the Hadoop tutorial provided with the assignment
		// write-up.
		// I found the link on Piazza:
		// http://wiki.apache.org/hadoop/WordCount
		Configuration conf = new Configuration();
		Job job = new Job(conf, "iter");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperIter.class);
		job.setReducerClass(RecommendReducerIter.class);

		// Set the input directory.
		FileInputFormat.addInputPath(job, new Path(input));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(output);
		FileOutputFormat.setOutputPath(job, new Path(output));

		// Set the number of reducers from our command args
		job.setNumReduceTasks(Integer.parseInt(args[3]));

		// Wait for the job to finish
		job.waitForCompletion(true);
	}

	/**
	 * Execute the "diff" command on the provided arguments.
	 * 
	 * @param args
	 *            the arguments to run "diff" with.
	 * @throws Exception
	 */
	private static void diff(String[] args) throws Exception {
		// Grab the input paths and output path
		String input1 = args[1];
		String input2 = args[2];
		String output = args[3];

		// The "diff" command runs as two separate MapReduce jobs, as
		// suggested by the handout. A temporary output directory is
		// specified to allow output to be passed between these two
		// jobs.
		String mid = "diffMid";

		// The first step of diff gets rank differences for each vertex
		// and stores them in the "diffMid" directory.
		Configuration conf = new Configuration();
		Job job = new Job(conf, "diff");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperDiff.class);
		job.setReducerClass(RecommendReducerDiff.class);

		// Set the input directories.
		FileInputFormat.addInputPath(job, new Path(input1));
		FileInputFormat.addInputPath(job, new Path(input2));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(mid);
		FileOutputFormat.setOutputPath(job, new Path(mid));

		// Set the number of reducers from our command args
		job.setNumReduceTasks(Integer.parseInt(args[4]));

		// Wait for the job to finish
		job.waitForCompletion(true);

		// Because the "readDiffResult" method, which will be used when
		// checking for convergence, only reads the very first "diff"
		// value, to check for the very first instance of convergence
		// the output list of absolute differences must be sorted such
		// that the largest difference is at the top.
		// Note: on Piazza, a TA described this function
		// as: The diff function outputs a single value that is the
		// maximum absolute difference between any any pair of values
		// for each vertex. Therefore only the maximum absolute
		// difference is output.
		job = new Job(conf, "sort");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperSort.class);
		job.setReducerClass(RecommendReducerSort.class);

		// Set the input directory.
		FileInputFormat.addInputPath(job, new Path(mid));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(output);
		FileOutputFormat.setOutputPath(job, new Path(output));

		// The sorting job uses a single reducer.
		job.setNumReduceTasks(1);

		// Wait for the job to finish
		job.waitForCompletion(true);
	}

	/**
	 * Execute the "finish" command on the provided arguments.
	 * 
	 * @param args
	 *            the arguments to run "finish" with.
	 * @throws Exception
	 */
	private static void finish(String[] args) throws Exception {
		// Grab our input and output paths
		String input = args[1];
		String output = args[2];

		// Most of this boilerplate setup was followed from the updated
		// version of the Hadoop tutorial provided with the assignment
		// write-up.
		// I found the link on Piazza:
		// http://wiki.apache.org/hadoop/WordCount
		Configuration conf = new Configuration();
		Job job = new Job(conf, "finish");
		job.setJarByClass(RecommendDriver.class);

		// Set our intermediate key and value.
		// The need to use a DoubleWritable for "finish" is explained in
		// the SocialRankMapperFinish class.
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);

		// Set our map and reduce methods
		job.setMapperClass(RecommendMapperFinish.class);
		job.setReducerClass(RecommendReducerFinish.class);

		// Set the input directory.
		FileInputFormat.addInputPath(job, new Path(input));

		// If the output directory already exists, delete it before
		// setting the new output directory.
		deleteDirectory(output);
		FileOutputFormat.setOutputPath(job, new Path(output));

		// The finish command sorts our output.
		// I implemented this using a single reducer, so that the output will
		// all wind up in the same file.
		//
		// However, per Piazza exchange: "My finish output for each
		// reducer is sorted. However the top nodes are not always in
		// the first reducer output file when using multiple reducers.
		// How can we ensure that the first output file will have the
		// global top values when using multiple reducers?"
		//
		// Andreas Haeberlen: It's fine to have multiple
		// output files if the user requests more than one reducer.
		// Therefore I honor the user-requested number of reducers, even
		// if the output is now only piecewise-sorted within multiple
		// output files.
		//
		// I took "it's fine" to mean this is a design choice. If this is
		// undesirable, change the below "1" to "Integer.parseInt(args[3])."
		job.setNumReduceTasks(1);

		// Wait for the job to finish
		job.waitForCompletion(true);
	}

	/**
	 * Given an output folder, returns the first double from the first
	 * part-r-00000 file specified by the provided path.
	 * 
	 * @param path
	 *            path to the directory to search for the diff result in.
	 * @return the first encountered diff result.
	 * @throws Exception
	 */
	static double readDiffResult(String path) throws Exception {
		double diffnum = 0.0;
		Path diffpath = new Path(path);
		Configuration conf = new Configuration();
		FileSystem fs = FileSystem.get(URI.create(path), conf);

		if (fs.exists(diffpath)) {
			FileStatus[] ls = fs.listStatus(diffpath);
			for (FileStatus file : ls) {
				if (file.getPath().getName().startsWith("part-r-00000")) {
					FSDataInputStream diffin = fs.open(file.getPath());
					BufferedReader d = new BufferedReader(
							new InputStreamReader(diffin));
					String diffcontent = d.readLine();
					diffnum = Double.parseDouble(diffcontent);
					d.close();
				}
			}
		}

		fs.close();
		return diffnum;
	}

	/**
	 * Deletes a directory specified by the provided path.
	 * 
	 * @param path
	 *            the path to the directory that should be deleted.
	 * @throws Exception
	 */
	static void deleteDirectory(String path) throws Exception {
		Path todelete = new Path(path);
		Configuration conf = new Configuration();
		FileSystem fs = FileSystem.get(URI.create(path), conf);

		if (fs.exists(todelete))
			fs.delete(todelete, true);

		fs.close();
	}

}
